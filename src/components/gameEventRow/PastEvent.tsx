//src/components/GameEventRow/PastEvent.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GameEvent } from '../../types/event';
import { colors } from '../../theme/colors';
import { format } from 'date-fns';

interface Props {
    event: GameEvent;
    onPress: (event: GameEvent) => void;
}

export const PastEvent: React.FC<Props> = ({ event, onPress }) => {
    const capitalizeFirstLetter = (string: string | undefined): string => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };
    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(event)}>
            <View style={styles.content}>
                {event.title && (
                    <Text style={styles.title} numberOfLines={2}>
                        {event.title}
                    </Text>
                )}

                <View style={styles.timeInfo}>
                    {event.type.name && (
                        <Text style={styles.type}>{event.type.name}</Text>
                    )}
                    <Text style={styles.date}>
                        {format(new Date(event.startDateTime), 'MM/dd/yyyy')}
                    </Text>
                    <Text style={styles.time}>
                        {format(new Date(event.startDateTime), 'HH:mm')}-
                        {format(new Date(event.endDateTime), 'HH:mm')}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <View style={styles.leftFooter}>
                        <View style={styles.badge}>
                            <View style={[styles.dot, { backgroundColor: '#8BC34A' }]} />
                            <Text style={styles.badgeText}>
                                {capitalizeFirstLetter(event.broadcast?.type)}
                            </Text>
                        </View>
                        <View style={styles.pillBadge}>
                            <Text style={styles.pillText}>stream</Text>
                        </View>
                        <View style={styles.pillBadge}>
                            <Text style={styles.pillText}>record</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 4,
    },
    timeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    type: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    date: {
        fontSize: 12,
    },
    time: {
        fontSize: 12,
    },
    countdown: {
        fontSize: 12,
        marginBottom: 8,
    },
    countdownLabel: {
        color: colors.text,
    },
    countdownValue: {
        color: colors.primary,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '500',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500',
    },
    leftFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pillBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    pillText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
});