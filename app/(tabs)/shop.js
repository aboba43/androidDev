import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../store/cartSlice';
import { logoutUser } from '../../store/userSlice';
import { router } from 'expo-router';

// --- Компонент UI Магазину ---
function CryptoShop() {
  // Читаємо дані зі сховища Redux
  const products = useSelector((state) => state.cart.products);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = useSelector((state) => state.user);

  // useDispatch використовується для виклику дій (actions)
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    router.replace('/');
  };

  // Рахуємо загальну суму кошика
  const totalCartPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <SafeAreaView style={styles.container}>

      {/* Профіль Користувача */}
      {user.isRegistered && (
        <View style={styles.profileSectionWrapper}>
          <TouchableOpacity 
            style={styles.profileSection} 
            onPress={() => router.push('/edit-profile')}
          >
            {user.avatarUri ? (
              <Image source={{ uri: user.avatarUri }} style={styles.profileAvatar} />
            ) : (
              <View style={styles.profileAvatarPlaceholder} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Вийти</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Список товарів (Криптовалют) */}
      <View style={styles.section}>
        <Text style={styles.headerTitle}>Крипто Маркет</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.coinName}>{item.name} ({item.symbol})</Text>
                <Text style={styles.coinPrice}>${item.price}</Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => dispatch(addToCart(item))}
              >
                <Text style={styles.buttonText}>Купити</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Кошик */}
      <View style={styles.cartSection}>
        <Text style={styles.headerTitle}>Кошик: ${totalCartPrice.toLocaleString()}</Text>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>Кошик порожній</Text>
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartCard}>
                <Text style={styles.cartItemText}>
                  {item.symbol} x{item.quantity}
                </Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => dispatch(removeFromCart(item.id))}
                >
                  <Text style={styles.buttonText}>Видалити</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

    </SafeAreaView>
  );
}

export default function App() {
  return (
    <CryptoShop />
  );
}

// --- Стилі ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    flex: 2,
    padding: 15,
  },
  cartSection: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coinName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  coinPrice: {
    fontSize: 14,
    color: '#28a745',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  cartCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cartItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontStyle: 'italic',
  },
  profileSectionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});