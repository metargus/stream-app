// src/screens/SignIn/styles.ts
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
        justifyContent: 'center',
    },
    logo: {
        width: width * 0.7,
        height: 100,
        alignSelf: 'center',
        marginBottom: 32,
        resizeMode: 'contain',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputWrapper: {
        borderWidth: 0.5,
        borderRadius: 6,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        minHeight: 52,
        paddingHorizontal: 16,
    },
    inputWrapperFocused: {
        borderColor: colors.primary,
    },
    input: {
        flex: 1,
        color: colors.text,
        fontSize: 16,
    },
    floatingLabel: {
        position: 'absolute',
        left: 14,
        top: -8,
        backgroundColor: colors.background,
        paddingHorizontal: 4,
        fontSize: 12,
        color: colors.textSecondary,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyeIcon: {
        padding: 8,
    },
    signInButton: {
        backgroundColor: colors.controlButton,
        height: 48,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    signInButtonDisabled: {
        opacity: 0.6,
    },
    signInText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4285F4',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    googleButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});