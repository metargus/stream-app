// src/screens/Organizations/EmptyState.tsx
import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { styles } from './styles';
import { colors } from '../../theme/colors';

export const EmptyState: React.FC = () => {
    return (
        <View style={styles.emptyContainer}>
            <Icon
                name="users"
                size={48}
                color={colors.textSecondary}
                style={{ marginBottom: 16 }}
            />
            <Text style={styles.emptyText}>
                No organizations available
            </Text>
        </View>
    );
};