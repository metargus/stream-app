// src/screens/Organizations/Navbar.tsx
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const Navbar: React.FC = () => {
    const { signOut } = useAuth();
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await signOut();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
            });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer} />
            <View style={styles.centerContainer}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.rightContainer}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Icon name="log-out" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    leftContainer: {
        flex: 1,
    },
    centerContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: 16,
    },
    logo: {
        height: 32,
        width: '100%',
    },
    logoutButton: {
        padding: 8,
    },
});