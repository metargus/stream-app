//src/components/GameEventRow/BroadcastingLiveEvent.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { GameEvent } from '../../types/event';
import { colors } from '../../theme/colors';

interface Props {
    event: GameEvent;
    onPress: (event: GameEvent) => void;
}

export const BroadcastingLiveEvent: React.FC<Props> = ({ event, onPress }) => {
    console.log(event)
    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(event)}>
            {event?.broadcast?.state === "running" && <View style={styles.header}>
                <View style={styles.liveIndicator}>
                    <Text style={styles.streamingText}>STREAMING</Text>
                    <View style={styles.dot} />
                </View>
                <View style={styles.broadcastInfo}>
                    <Icon name="radio" size={16} color={colors.primary} />
                    <Text style={styles.liveText}>LIVE</Text>
                </View>
            </View>
            }
            
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {event.title}
                </Text>
                {event.type.name && (
                    <>
                        <View style={styles.divider} />
                        <Text style={styles.type}>{event.type.name}</Text>
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    streamingText: {
        fontSize: 12,
        marginRight: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
    },
    broadcastInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    liveText: {
        marginLeft: 4,
        fontSize: 12,
    },
    content: {
        padding: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        width: '100%',
        marginVertical: 12,
    },
    type: {
        fontSize: 14,
        color: colors.textSecondary,
    },
});