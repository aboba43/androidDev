import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Динамічно отримуємо IP-адресу сервера, щоб працювало і на телефоні
const debuggerHost = Constants.expoConfig?.hostUri;
let API_URL = 'http://localhost:3000';

if (debuggerHost) {
  API_URL = `http://${debuggerHost.split(':')[0]}:3000`;
} else if (Platform.OS === 'android') {
  API_URL = 'http://10.0.2.2:3000';
}

export const initDB = async () => {
  // База даних тепер ініціалізується на сервері
  console.log('Using remote server for database operations.');
};

export const getUser = async () => {
  // Local auto-login is no longer managed by database.js directly fetching the last row.
  return null;
};

export const saveUser = async (name, email, password, avatarUri) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, avatarUri }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error saving user on server:', error);
    return null;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error logging in on server:', error);
    return null;
  }
};

export const updateUser = async (email, name, avatarUri) => {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, avatarUri }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Update failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating user on server:', error);
    return null;
  }
};

export const saveRecords = async (email, bench, squat, deadlift) => {
  try {
    const response = await fetch(`${API_URL}/records`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, bench, squat, deadlift }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Update records failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error saving records on server:', error);
    return null;
  }
};
