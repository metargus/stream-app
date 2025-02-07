//src/components/GameEventRow/UpcomingEvent.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GameEvent } from '../../types/event';
import { colors } from '../../theme/colors';
import { format } from 'date-fns';

interface Props {
    event: GameEvent;
    onPress: (event: GameEvent) => void;
}

export const UpcomingEvent: React.FC<Props> = ({ event, onPress }) => {
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const start = new Date(event.startDateTime);
            const diff = start.getTime() - now.getTime();

            if (diff <= 0) {
                setCountdown('Event started');
                return;
            }

            // Convert to units
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (days >= 30) {
                setCountdown(`${Math.floor(days / 30)}mo ${days % 30}d`);
            } else if (days > 0) {
                setCountdown(`${days}d ${hours}h`);
            } else {
                setCountdown(`${hours}h ${minutes}m`);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [event.startDateTime]);

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

                <Text style={styles.countdown}>
                    <Text style={styles.countdownLabel}>Starts in </Text>
                    <Text style={styles.countdownValue}>{countdown}</Text>
                </Text>

                <View style={styles.footer}>
                    <View style={styles.tag}>
                        <View style={[styles.dot, { backgroundColor: 'green' }]} />
                        <Text style={styles.tagText}>lorem ipsum</Text>
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>lorem</Text>
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>ipsum</Text>
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
        alignItems: 'center',
        gap: 8,
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
        backgroundColor: colors.background,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500',
    },
});