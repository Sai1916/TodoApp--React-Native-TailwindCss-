import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Todo from '../src/screens/Todo';
import Profile from '../src/screens/Profile';
import AddTodo from '../src/screens/AddTodo';

const Stack = createNativeStackNavigator();

export const TodoStack = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen 
            name="Todo" 
            component={Todo}
            options={{
              headerShown: false,
            }}
            
        />
        <Stack.Screen 
            name="AddTodo" 
            component={AddTodo}
            options={{
              headerShown: false,
            }}
            presentation={'modal'}
        />
    </Stack.Navigator>
  )
}

export const ProfileStack = () => {
  return (
    <Stack.Navigator>
        <Stack.Screen 
            name="Profile" 
            component={Profile}
            options={{
              headerShown: false,
            }}
        />
    </Stack.Navigator>
  )
}
