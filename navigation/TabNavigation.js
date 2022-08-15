import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {Feather,Octicons} from 'react-native-vector-icons';
import { ProfileStack, TodoStack } from './StackNavigation';
import { useTailwind } from 'tailwindcss-react-native';

const Navigation = () => {

    const Tab = createBottomTabNavigator();

    const tw = useTailwind();

    const color = tw("bg-blue-600");

  return (
    <Tab.Navigator
        screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveBackgroundColor: "#8987ff",
            tabBarActiveTintColor: "white",
            tabBarItemStyle: {
                borderRadius: 50,
                marginHorizontal: 12,
            },
        }}
    >
        <Tab.Screen 
            name="Task Saver"
            component={TodoStack}
            options={{
              //headerShown: false,
              tabBarIcon: ({ color }) => (
                <Octicons name="tasklist" size={26} color={color} />
              ),
              headerStyle : {
                backgroundColor : 'skyblue',
              }
            }}
        />
        <Tab.Screen 
            name="ProfileStack"
            component={ProfileStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <Feather name="user" size={26} color={color} />
              ),
            }}
        />

    </Tab.Navigator>
  )
}

export default Navigation