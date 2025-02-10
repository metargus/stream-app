//src/components/GameEventRow/UpcomingEvent.tsx
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GameEvent} from '../../types/event';
import {colors} from '../../theme/colors';
import {format} from 'date-fns';

interface Props {
    event: GameEvent;
    onPress: (event: GameEvent) => void;
}

export const UpcomingEvent: React.FC<Props> = ({ event, onPress }) => {
    const [countdown, setCountdown] = useState('');
    
    console.log(event)

    const capitalizeFirstLetter = (string: string | undefined): string => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

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
                        {format(new Date(event.startDateTime), 'HH:mm')} - {''}
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

                    <View style={styles.rightFooter}>
                        <Text style={styles.startAtLabel}>Start at:</Text>
                        <Text style={styles.startAtTime}>{countdown}</Text>
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
        display: 'flex',
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
    startsAt: {
        backgroundColor: colors.background,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
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
    rightFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
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
    startAtLabel: {
        fontSize: 12,
        color: colors.text,
        fontWeight: '500',
    },
    startAtTime: {
        fontSize: 12,
        color: '#FF7043',
        fontWeight: '500',
    },
});