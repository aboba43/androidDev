import { createSlice } from '@reduxjs/toolkit';

// Початковий стан: список 8 криптовалют та порожній кошик
const initialState = {
  products: [
    { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 64000 },
    { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3100 },
    { id: '3', name: 'Tether', symbol: 'USDT', price: 1 },
    { id: '4', name: 'BNB', symbol: 'BNB', price: 580 },
    { id: '5', name: 'Solana', symbol: 'SOL', price: 145 },
    { id: '6', name: 'Ripple', symbol: 'XRP', price: 0.5 },
    { id: '7', name: 'Cardano', symbol: 'ADA', price: 0.45 },
    { id: '8', name: 'Dogecoin', symbol: 'DOGE', price: 0.15 },
  ],
  cartItems: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Дія: Додати товар у кошик
    addToCart: (state, action) => {
      const itemExists = state.cartItems.find(item => item.id === action.payload.id);
      if (itemExists) {
        itemExists.quantity += 1; // Якщо вже є, збільшуємо кількість
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },
    // Дія: Видалити товар з кошика
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;