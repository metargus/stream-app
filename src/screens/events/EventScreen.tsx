//src/screens/Events/EventsScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    SectionList,
    RefreshControl,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EventRow } from '../../components/gameEventRow/EventRow';
import { GameEvent } from '../../types/event';
import { colors } from '../../theme/colors';
import eventService from '../../services/event';
import { addDays, subDays } from 'date-fns';
import { MainStackParamList } from '../../navigation/types';

type EventsScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Events'>;
type EventsScreenRouteProp = RouteProp<MainStackParamList, 'Events'>;

type Section = {
    title: string;
    data: GameEvent[];
};

export const EventsScreen = () => {
    const route = useRoute<EventsScreenRouteProp>();
    const navigation = useNavigation<EventsScreenNavigationProp>();
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [sections, setSections] = useState<Section[]>([]);

    const organizationId = route.params.organizationId;

    const fetchEvents = useCallback(async (showRefreshing = false) => {
        try {
            if (showRefreshing) {
                setIsRefreshing(true);
            }

            const now = new Date();
            const events = await eventService.getGameEvents(
                organizationId,
                subDays(now, 1), // Get events from 1 month ago
                addDays(now, 1)  // Get events up to 2 months in the future
            );

            // Split events into upcoming and past
            const upcoming = events.filter(e => new Date(e.endDateTime) >= now);
            const past = events.filter(e => new Date(e.endDateTime) < now);
            
            console.log(past)

            setSections([
                { title: 'UPCOMING', data: upcoming },
                { title: 'PAST EVENTS', data: past },
            ]);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [organizationId]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleRefresh = () => {
        fetchEvents(true);
    };

    const handleEventPress = (event: GameEvent) => {
        navigation.navigate('GameEventDetails', {
            id: event.id,
            organizationId,
            type: event.type.code
        });
    };

    if (isLoading && !isRefreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <EventRow event={item} onPress={handleEventPress} />
            )}
            renderSectionHeader={({ section: { title } }) => (
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{title}</Text>
                </View>
            )}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    tintColor={colors.primary}
                    colors={[colors.primary]}
                />
            }
            contentContainerStyle={styles.contentContainer}
            stickySectionHeadersEnabled={false}
        />
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        paddingBottom: 16,
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.background,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
});