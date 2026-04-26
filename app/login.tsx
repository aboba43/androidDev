import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/userSlice'; // Reusing this action to set current user
import { router } from 'expo-router';
import { loginUser } from '../utils/database';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Помилка', 'Будь ласка, введіть email та пароль');
      return;
    }

    const user = await loginUser(email, password);

    if (user) {
      // Зберігаємо в Redux
      dispatch(registerUser({
        name: user.name,
        email: user.email,
        avatarUri: user.avatarUri,
      }));

      // Перехід до головного меню (табів)
      router.replace('/shop');
    } else {
      Alert.alert('Помилка', 'Невірний email або пароль');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Вхід в акаунт</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Введіть ваш email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Пароль</Text>
          <TextInput
            style={styles.input}
            placeholder="Введіть пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Увійти</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.linkButton} onPress={() => router.back()}>
          <Text style={styles.linkText}>Немає акаунту? Зареєструватися</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '500',
  },
});
