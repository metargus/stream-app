// src/navigation/MainNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainStackParamList } from './types';

const Stack = createStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Organizations" component={OrganizationsScreen} />
            <Stack.Screen name="OrganizationDetails" component={OrganizationDetailsScreen} />
            <Stack.Screen name="GameEventDetails" component={GameEventDetailsScreen} />
        </Stack.Navigator>
    );
};