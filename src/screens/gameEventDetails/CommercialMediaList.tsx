// src/screens/GameEventDetails/CommercialMediaList.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../theme/colors';
import { CommercialMedia } from '../../types/event.ts';

interface CommercialMediaListProps {
    media: CommercialMedia[];
    onPlayMedia?: (mediaId: string) => void;
}

export const CommercialMediaList: React.FC<CommercialMediaListProps> = ({
        media,
        onPlayMedia
    }) => {
    return (
        <View style={styles.container}>
            {media.map((item, index) => (
                <React.Fragment key={item.id}>
                    <View style={styles.mediaItem}>
                        <Text style={styles.fileName} numberOfLines={1}>
                            {item.fileName || 'Untitled'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => onPlayMedia?.(item.id)}
                            style={styles.playButton}
                        >
                            <Icon name="play" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    {index < media.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 16,
    },
    mediaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    fileName: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        marginRight: 16,
    },
    playButton: {
        padding: 8,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
        marginVertical: 8,
    },
});