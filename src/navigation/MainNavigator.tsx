// src/navigation/MainNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainStackParamList } from './types';
import { OrganizationsScreen } from '../screens/organizations/OrganizationsScreen.tsx';
import { EventsScreen} from "../screens/events/EventScreen.tsx";

const Stack = createStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Organizations" component={OrganizationsScreen} />
            {/*<Stack.Screen name="OrganizationDetails" component={OrganizationDetailsScreen} />*/}
            <Stack.Screen name="Events" component={EventsScreen} options={({ route }) => ({title: 'Events'})}/>        
        </Stack.Navigator>
    );
};