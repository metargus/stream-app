//src/components/GameEventRow/EventRow.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GameEvent } from '../../types/event';
import { BroadcastingLiveEvent } from './BroadcastingLiveEvent';
import { UpcomingEvent } from './UpcomingEvent';
import { PastEvent } from './PastEvent';
import { colors } from '../../theme/colors';

interface Props {
    event: GameEvent;
    onPress: (event: GameEvent) => void;
}

export const EventRow: React.FC<Props> = ({ event, onPress }) => {
    const isLive = isEventLive(event);
    const isPast = isEventPast(event);

    return (
        <View style={styles.container}>
            {isLive ? (
                <BroadcastingLiveEvent event={event} onPress={onPress} />
            ) : isPast ? (
                <PastEvent event={event} onPress={onPress} />
            ) : (
                <UpcomingEvent event={event} onPress={onPress} />
            )}
        </View>
    );
};

function isEventLive(event: GameEvent): boolean {
    const broadcastState = event.broadcast?.state;
    return broadcastState === 'running';
}

function isEventPast(event: GameEvent): boolean {
    if (event.broadcast?.state === 'finished') return true;
    const now = new Date();
    const endDate = new Date(event.endDateTime);
    return endDate < now;
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
});