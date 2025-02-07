// src/navigation/MainNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainStackParamList } from './types';
import { OrganizationsScreen } from '../screens/organizations/OrganizationsScreen.tsx';
import { EventsScreen} from "../screens/events/EventScreen.tsx";
import { GameEventDetailsScreen } from "../screens/gameEventDetails/GameEventDetailsScreen.tsx";

const Stack = createStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Organizations" component={OrganizationsScreen} />
            <Stack.Screen
                name="Events"
                component={EventsScreen}
            />
            <Stack.Screen
                name="GameEventDetails"
                component={GameEventDetailsScreen}
            />
        </Stack.Navigator>
    );
};