const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let db;

// Initialize the database
async function initDB() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      avatarUri TEXT,
      bench REAL DEFAULT 0,
      squat REAL DEFAULT 0,
      deadlift REAL DEFAULT 0
    );
  `);
  
  // Try adding columns if table already existed without them
  try { await db.exec('ALTER TABLE users ADD COLUMN bench REAL DEFAULT 0'); } catch(e) {}
  try { await db.exec('ALTER TABLE users ADD COLUMN squat REAL DEFAULT 0'); } catch(e) {}
  try { await db.exec('ALTER TABLE users ADD COLUMN deadlift REAL DEFAULT 0'); } catch(e) {}

  console.log('Backend database initialized.');
}

// Endpoint: Register User
app.post('/register', async (req, res) => {
  const { name, email, password, avatarUri } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.run(
      'INSERT INTO users (name, email, password, avatarUri) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, avatarUri]
    );
    res.status(201).json({ id: result.lastID, name, email, avatarUri, bench: 0, squat: 0, deadlift: 0 });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Endpoint: Login User
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // Don't send the password back to the client
        const { password: _, ...safeUser } = user;
        res.status(200).json(safeUser);
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint: Update User Profile
app.put('/user', async (req, res) => {
  const { email, name, avatarUri } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required' });
  }

  try {
    const result = await db.run(
      'UPDATE users SET name = ?, avatarUri = ? WHERE email = ?',
      [name, avatarUri, email]
    );

    if (result.changes > 0) {
      res.status(200).json({ message: 'Profile updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint: Update User Records
app.put('/records', async (req, res) => {
  const { email, bench, squat, deadlift } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    await db.run(
      'UPDATE users SET bench = ?, squat = ?, deadlift = ? WHERE email = ?',
      [bench || 0, squat || 0, deadlift || 0, email]
    );
    res.status(200).json({ message: 'Records updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

initDB();

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
