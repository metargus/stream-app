// src/screens/GameEventDetails/GameEventDetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Switch,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../theme/colors';
import { GameEventDetailsState } from '../../types/event.ts';
import { CommercialMediaList } from './CommercialMediaList';
import {MainStackParamList} from "../../navigation/types.ts";
import gameEvent from "../../services/gameEvent.ts";
import {createEventUpdateRequest, EventUpdateRequest} from "../../types/eventUpdate.ts";
import WebView from "react-native-webview";

type TabType = 'event' | 'gameDetails' | 'cameraAndAudio' | 'videos';

export const GameEventDetailsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('event');
    const [state, setState] = useState<GameEventDetailsState>({
        id: '',
        kind: '',
        organization: '',
        dataStatus: { isExecuting: false, hasError: false },
        updateStartsAtStatus: { isExecuting: false, hasError: false },
        updateEndsAtStatus: { isExecuting: false, hasError: false },
        updateStreamKeyStatus: { isExecuting: false, hasError: false },
        updateHomeTeamNameStatus: { isExecuting: false, hasError: false },
        updateAwayTeamNameStatus: { isExecuting: false, hasError: false },
        updateCompetitionNameStatus: { isExecuting: false, hasError: false },
        updatePictureInPictureStatus: { isExecuting: false, hasError: false },
        startsAt: new Date(),
        endsAt: new Date(),
        streamKey: '',
        homeTeamName: '',
        awayTeamName: '',
        competitionName: '',
        pictureInPicture: false,
        editableSection: 'event'
    });

    const route = useRoute<RouteProp<MainStackParamList, 'GameEventDetails'>>();
    const { id, organizationId, type } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEventDetails();
    }, []);

    const fetchEventDetails = async () => {
        try {
            setIsLoading(true);
            const event = await gameEvent.getGameEvent(id, type, organizationId);
            setState(prev => ({
                ...prev,
                event,
                startsAt: new Date(event.startDateTime),
                endsAt: new Date(event.endDateTime),
                streamKey: event.broadcast?.youtubeStreamKey || '',
                homeTeamName: event.homeTeamName || '',
                awayTeamName: event.awayTeamName || '',
                competitionName: event.competitionName || ''
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load event');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResumeBroadcast = async () => {
        try {
            if (!state.event?.broadcast?.id) return;
            setIsLoading(true);
            await gameEvent.resumeBroadcast(
                state.event.broadcast.id,
                organizationId
            );
            await fetchEventDetails();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resume broadcast');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePauseBroadcast = async () => {
        try {
            if (!state.event?.broadcast?.id) return;
            setIsLoading(true);
            await gameEvent.pauseBroadcast(
                state.event.broadcast.id,
                organizationId
            );
            await fetchEventDetails();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to pause broadcast');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStopBroadcast = async () => {
        try {
            if (!state.event?.broadcast?.id) return;
            setIsLoading(true);
            await gameEvent.stopBroadcast(
                state.event.broadcast.id,
                organizationId
            );
            await fetchEventDetails();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to stop broadcast');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle event updates
    const handleUpdateEvent = async (updateData: Partial<EventUpdateRequest>) => {
        try {
            if (!state.event) return;
            setIsLoading(true);
            const request = createEventUpdateRequest(state.event);
            const updatedEvent = await gameEvent.updateGameEvent(
                id,
                type,
                organizationId,
                {
                    ...request,
                    ...updateData
                }
            );
            setState(prev => ({
                ...prev,
                event: updatedEvent
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update event');
        } finally {
            setIsLoading(false);
        }
    };

    const renderTabs = () => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'event' && styles.activeTab]}
                onPress={() => setActiveTab('event')}
            >
                <Icon name="calendar" size={20} color={activeTab === 'event' ? colors.primary : colors.textSecondary} />
                <Text style={[styles.tabText, activeTab === 'event' && styles.activeTabText]}>Event</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab, activeTab === 'gameDetails' && styles.activeTab]}
                onPress={() => setActiveTab('gameDetails')}
            >
                <Icon name="activity" size={20} color={activeTab === 'gameDetails' ? colors.primary : colors.textSecondary} />
                <Text style={[styles.tabText, activeTab === 'gameDetails' && styles.activeTabText]}>Game Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab, activeTab === 'cameraAndAudio' && styles.activeTab]}
                onPress={() => setActiveTab('cameraAndAudio')}
            >
                <Icon name="camera" size={20} color={activeTab === 'cameraAndAudio' ? colors.primary : colors.textSecondary} />
                <Text style={[styles.tabText, activeTab === 'cameraAndAudio' && styles.activeTabText]}>Camera & Audio</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
                onPress={() => setActiveTab('videos')}
            >
                <Icon name="video" size={20} color={activeTab === 'videos' ? colors.primary : colors.textSecondary} />
                <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>Videos</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'event':
                return renderEventTab();
            case 'gameDetails':
                return renderGameDetailsTab();
            case 'cameraAndAudio':
                return renderCameraAndAudioTab();
            case 'videos':
                return renderVideosTab();
            default:
                return null;
        }
    };

    const renderEventTab = () => (
        <View style={styles.tabContent}>
            <View style={styles.controlButtons}>
                {state.event?.broadcast?.state === 'paused' ? (
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={handleResumeBroadcast}
                        disabled={isLoading}
                    >
                        <Icon name="play" size={24} color={colors.white} />
                        <Text style={styles.controlButtonText}>Resume</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={handlePauseBroadcast}
                        disabled={isLoading}
                    >
                        <Icon name="pause" size={24} color={colors.white} />
                        <Text style={styles.controlButtonText}>Pause</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleStopBroadcast}
                    disabled={isLoading}
                >
                    <Icon name="stop" size={24} color={colors.white} />
                    <Text style={styles.controlButtonText}>Stop</Text>
                </TouchableOpacity>
            </View>

            {/* Date/Time fields */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Starts at</Text>
                <TouchableOpacity style={styles.dateInput}>
                    <Text>{state.startsAt.toLocaleString()}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Ends at</Text>
                <TouchableOpacity style={styles.dateInput}>
                    <Text>{state.endsAt.toLocaleString()}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Stream Key</Text>
                <TextInput
                    style={styles.textInput}
                    value={state.streamKey}
                    onChangeText={(text) => setState(prev => ({ ...prev, streamKey: text }))}
                />
            </View>
        </View>
    );

    const renderGameDetailsTab = () => (
        <View style={styles.tabContent}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Home Team</Text>
                <TextInput
                    style={styles.textInput}
                    value={state.homeTeamName}
                    onChangeText={(text) => setState(prev => ({ ...prev, homeTeamName: text }))}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Away Team</Text>
                <TextInput
                    style={styles.textInput}
                    value={state.awayTeamName}
                    onChangeText={(text) => setState(prev => ({ ...prev, awayTeamName: text }))}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Competition Name</Text>
                <TextInput
                    style={styles.textInput}
                    value={state.competitionName}
                    onChangeText={(text) => setState(prev => ({ ...prev, competitionName: text }))}
                />
            </View>
        </View>
    );

    const renderCameraAndAudioTab = () => (
        <View style={styles.tabContent}>
            <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Picture in Picture</Text>
                <Switch
                    value={state.pictureInPicture}
                    onValueChange={(value) => setState(prev => ({ ...prev, pictureInPicture: value }))}
                />
            </View>

            <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Pan & Zoom</Text>
                <Switch
                    value={false}
                    onValueChange={() => {}}
                />
            </View>

            <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Audio Input</Text>
                <Switch
                    value={false}
                    onValueChange={() => {}}
                />
            </View>

            <Text style={styles.autoSaveText}>Changes are saved automatically</Text>
        </View>
    );

    const renderVideosTab = () => (
        <View style={styles.tabContent}>
            {state.event?.media && state.event.media.length > 0 ? (
                <CommercialMediaList media={state.event.media} />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No media available</Text>
                </View>
            )}
        </View>
    );

    if (state.dataStatus.isExecuting) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchEventDetails}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {state.event?.ytBroadcastDetails?.broadcastId && (
                <View style={styles.videoContainer}>
                    <WebView
                        style={styles.webview}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        source={{
                            uri: `https://www.youtube.com/embed/${state.event.ytBroadcastDetails.broadcastId}`
                        }}
                    />
                </View>
            )}

            {renderTabs()}

            <ScrollView style={styles.content}>
                {renderContent()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingHorizontal: 16,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginRight: 16,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
    },
    tabText: {
        marginLeft: 8,
        color: colors.textSecondary,
    },
    activeTabText: {
        color: colors.primary,
    },
    content: {
        flex: 1,
    },
    tabContent: {
        padding: 16,
    },
    controlButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    controlButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    controlButtonText: {
        color: colors.white,
        marginLeft: 8,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        color: colors.textSecondary,
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        backgroundColor: colors.surface,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyStateText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    autoSaveText: {
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: 16,
        textAlign: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomColor: colors.border,
    },
    toggleLabel: {
        fontSize: 16,
        color: colors.text,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
        gap: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    actionButtonText: {
        marginLeft: 8,
        color: colors.text,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.background,
    },
    errorText: {
        fontSize: 16,
        color: colors.error,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    retryButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    }
})