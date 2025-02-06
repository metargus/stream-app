// src/screens/Organizations/OrganizationRow.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Organization } from '../../types/organization';
import { styles } from './styles';
import { colors } from '../../theme/colors';

interface OrganizationRowProps {
    organization: Organization;
    onPress: (organization: Organization) => void;
}

export const OrganizationRow: React.FC<OrganizationRowProps> = ({
    organization,
    onPress
    }) => {
    return (
        <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => onPress(organization)}
        >
        {organization.logoUrl ? (
            <Image
                source={{ uri: organization.logoUrl }}
                style={styles.logo}
                resizeMode="cover"
            />
            ) : (
                <View style={styles.placeholderLogo}>
                <Icon name="users" size={14} color={colors.textSecondary} />
        </View>
        )}
    
        <Text style={styles.name} numberOfLines={1}>
            {organization.name || 'Unnamed Organization'}
            </Text>
    
            <Icon
                name="chevron-right"
                size={20}
                color={colors.textSecondary}
                style={styles.chevron}
        />
        </TouchableOpacity>
    );
};