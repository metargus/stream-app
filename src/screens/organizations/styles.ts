// src/screens/Organizations/styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    listContainer: {
        flex: 1,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
        marginLeft: 16,
    },
    // Row styles
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.surface,
    },
    logo: {
        width: 24,
        height: 24,
        marginRight: 12,
        borderRadius: 12,
    },
    placeholderLogo: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        color: colors.text,
        flex: 1,
    },
    chevron: {
        marginLeft: 8,
    }
});