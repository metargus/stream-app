import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Text, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {colors} from '../../theme/colors';
import {useAuth} from '../../contexts/AuthContext';
import {useNavigation, useRoute} from '@react-navigation/native';

interface NavbarProps {
    title?: string
}

export const Navbar: React.FC<NavbarProps> = ({title = null}) => {
    const {signOut} = useAuth();
    const navigation = useNavigation();
    const route = useRoute();

    const isOrganizationsScreen = route.name === 'Organizations';

    const colorScheme = useColorScheme();
    const darkModeActive = colorScheme === 'dark'

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={[styles.container, darkModeActive && {backgroundColor: 'black'}]}>
            <View style={styles.leftContainer}>
                <TouchableOpacity
                    onPress={isOrganizationsScreen ? handleLogout : handleBack}
                    style={styles.leftButton}
                >
                    <Icon
                        name={isOrganizationsScreen ? "log-out" : "arrow-left"}
                        size={24}
                        color={colors.primary}
                        style={isOrganizationsScreen ? {transform: [{rotateY: '180deg'}]} : undefined}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.centerContainer}>
                {!title ? <Image
                    source={darkModeActive? require('../../assets/logoDark.png') : require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                /> : <Text style={[styles.title, darkModeActive && {color: 'white'}]}>{title}</Text>}
            </View>
            <View style={styles.rightContainer}/>
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
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
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
        height: 40,
        width: '100%',
    },
    leftButton: {
        padding: 8,
    },
});