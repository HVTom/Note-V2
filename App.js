import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
// import screens
import NotesScreen from './screens/NotesScreen';
import TodosScreen from './screens/TodosScreen';
import NoteEditScreen from './screens/NoteEditScreen';
// icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
// navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
// notes context
import NotesContextProvider from "./context/NotesContext";


function MyStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerTitle: null,
      headerBackTitleVisible: false,
      headerRightContainerStyle: { marginRight: 16 },
      // headerLeftContainerStyle: { marginLeft: 16 },
      headerStyle: {
        elevation: 0
      }
    }}>
      <Stack.Screen name="NotesScreen"
        component={NotesScreen}
        options={{
          headerShown: false,
          tabBarActiveTintColor: 'blue',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="file-document-multiple-outline"
              size={24}
              color={color} />),
        }}>
      </Stack.Screen >
      <Stack.Screen name="NoteEditScreen"
        component={NoteEditScreen}
        options={{
          headerTitle: '',
        }}>
      </Stack.Screen >
    </Stack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Notes"
        component={MyStack}
        options={{
          headerShown: false,
          tabBarActiveTintColor: 'blue',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="file-document-multiple-outline" size={24} color={color} />),
        }}
      />
      <Tab.Screen
        name="Todos"
        component={TodosScreen}
        options={{
          headerShown: false,
          tabBarActiveTintColor: 'blue',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="alert-circle-check-outline" size={24} color={color} />),
        }}
      />
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <NotesContextProvider>
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </NotesContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
