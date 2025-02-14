// src/screens/SignIn/SignInScreen.tsx
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TextInputProps,
    Image,
    useColorScheme
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import authService from '../../services/auth';
import { styles } from './styles';
import { colors } from '../../theme/colors';
import { useAuth } from "../../contexts/AuthContext.tsx";

interface InputProps extends TextInputProps {
    label: string;
    hasValue: boolean;
    isFocused: boolean;
}

const FloatingLabelInput: React.FC<InputProps> = ({
      label,
      hasValue,
      isFocused,
      ...props
  }) => (
    <View style={styles.inputContainer}>
        <View style={[
            styles.inputWrapper,
            isFocused && styles.inputWrapperFocused
        ]}>
            <TextInput
                style={styles.input}
                placeholderTextColor={colors.textSecondary}
                {...props}
            />
        </View>
        {hasValue && (
            <Text style={styles.floatingLabel}>{label}</Text>
        )}
    </View>
);

export const SignInScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSecureText, setIsSecureText] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null);
    const { signIn, googleSignIn } = useAuth();

    const passwordInputRef = useRef<TextInput>(null);

    const handleSignIn = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await signIn(username.trim(), password);
            // Navigation will be handled automatically by the root navigator
        } catch (err) {
            setError(!!err ? err : 'Sign in failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            await authService.googleSignIn();
            await googleSignIn();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Google sign in failed');
        } finally {
            setIsLoading(false);
        }
    };

    const canSignIn = username.trim().length > 0 && password.length > 0 && !isLoading;

    const colorScheme = useColorScheme();
    const darkModeActive = colorScheme === 'dark'
    
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, darkModeActive && {backgroundColor: 'black'}]}        
        >
            <Image
                source={darkModeActive? require('../../assets/logoDark.png') : require('../../assets/logo.png')}
                style={styles.logo}
            />

            <FloatingLabelInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                autoCapitalize="none"
                autoComplete="username"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                blurOnSubmit={false}
                hasValue={username.length > 0}
                isFocused={focusedField === 'username'}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
            />

            <View style={styles.inputContainer}>
                <View style={[
                    styles.inputWrapper,
                    styles.passwordContainer,
                    focusedField === 'password' && styles.inputWrapperFocused
                ]}>
                    <TextInput
                        ref={passwordInputRef}
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        placeholderTextColor="#6A6A6A"
                        secureTextEntry={isSecureText}
                        autoComplete="password"
                        returnKeyType="go"
                        onSubmitEditing={canSignIn ? handleSignIn : undefined}
                        hasValue={password.length > 0}
                        isFocused={focusedField === 'password'}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                    />
                    <TouchableOpacity
                        onPress={() => setIsSecureText(!isSecureText)}
                        style={styles.eyeIcon}
                    >
                        <Icon
                            name={isSecureText ? 'eye' : 'eye-off'}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>
                {password.length > 0 && (
                    <Text style={styles.floatingLabel}>Password</Text>
                )}
            </View>

            <TouchableOpacity
                style={[
                    styles.signInButton,
                    !canSignIn && styles.signInButtonDisabled
                ]}
                onPress={handleSignIn}
                disabled={!canSignIn}
            >
                {isLoading ? (
                    <ActivityIndicator color={colors.white} />
                ) : (
                    <Text style={styles.signInText}>Sign In</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
            >
                {isLoading ? (
                    <ActivityIndicator color={colors.white} />
                ) : (
                    <Text style={styles.googleButtonText}>Sign in with Google</Text>
                )}
            </TouchableOpacity>

            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </KeyboardAvoidingView>
    );
};