import React from 'react';
import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

const MaterialTopTabs = createMaterialTopTabNavigator().Navigator;
const SwipeTabs = withLayoutContext(MaterialTopTabs);

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <SwipeTabs
      tabBarPosition="bottom"
      screenOptions={{
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#888',
        tabBarIndicatorStyle: {
          backgroundColor: '#007bff',
          height: 3,
        },
        tabBarStyle: {
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 5,
          paddingTop: 5,
          height: Platform.OS === 'ios' ? 55 + insets.bottom : 60,
          backgroundColor: '#fff',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          textTransform: 'none',
          marginTop: -2,
        },
        tabBarIconStyle: {
          width: 24,
          height: 24,
        },
        swipeEnabled: true,
      }}
    >
      <SwipeTabs.Screen
        name="shop"
        options={{
          title: 'Головна',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <SwipeTabs.Screen
        name="chat"
        options={{
          title: 'Чат',
          tabBarIcon: ({ color }) => <FontAwesome name="comments" size={24} color={color} />,
        }}
      />
      <SwipeTabs.Screen
        name="profile"
        options={{
          title: 'Профіль',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </SwipeTabs>
  );
}
