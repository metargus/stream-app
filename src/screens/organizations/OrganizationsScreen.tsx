// src/screens/Organizations/OrganizationsScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    ListRenderItem,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import { Organization } from '../../types/organization';
import { OrganizationRow } from './OrganizationRow';
import { EmptyState } from './EmptyState';
import { Navbar } from './NavBar.tsx';
import { styles } from './styles';
import { colors } from '../../theme/colors';
import organizationService from '../../services/organization';

type NavigationProp = StackNavigationProp<MainStackParamList, 'Organizations'>;

export const OrganizationsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrganizations = useCallback(async (showRefreshing = false) => {
        try {
            if (showRefreshing) {
                setIsRefreshing(true);
            }
            const data = await organizationService.getOrganizations();
            setOrganizations(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load organizations');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchOrganizations();
    }, [fetchOrganizations]);

    const handleRefresh = () => {
        fetchOrganizations(true);
    };

    const handleOrganizationPress = (organization: Organization) => {
        navigation.navigate('Events', { organizationId: organization.id });
    };

    const renderItem: ListRenderItem<Organization> = ({ item }) => (
        <OrganizationRow
            organization={item}
            onPress={handleOrganizationPress}
        />
    );

    const renderSeparator = () => <View style={styles.separator} />;

    const renderContent = () => {
        if (isLoading && !isRefreshing) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            );
        }

        return (
            <FlatList
                data={organizations}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={renderSeparator}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
                ListEmptyComponent={<EmptyState />}
                contentContainerStyle={organizations.length === 0 ? { flex: 1 } : undefined}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar />
            {renderContent()}
        </SafeAreaView>
    );
};