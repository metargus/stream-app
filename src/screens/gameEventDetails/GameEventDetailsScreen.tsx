// src/screens/GameEventDetails/GameEventDetailsScreen.tsx
import React, {useState, useEffect, useCallback} from 'react';
import { debounce } from 'lodash';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Switch,
    StyleSheet,
    ActivityIndicator, SafeAreaView,
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
import {Navbar} from "../organizations/NavBar.tsx";

type TabType = 'event' | 'gameDetails' | 'cameraAndAudio' | 'videos';

export const GameEventDetailsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('event');
    const [state, setState] = useState<GameEventDetailsState>({
        id: '',
        type: '',
        title: '',
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
        isCommentaryOn: false,
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
            const homeTeam = event.eventTeams?.find(team => team.isHomeTeam) || {name: ''};
            const awayTeam = event.eventTeams?.find(team => !team.isHomeTeam) || {name: ''};
            setState(prev => ({
                ...prev,
                event,
                title: event.title,
                startsAt: new Date(event.startDateTime),
                endsAt: new Date(event.endDateTime),
                streamKey: event.broadcast?.youtubeStreamKey || '',
                homeTeamName: homeTeam.name || '',
                awayTeamName: awayTeam.name || '',
                competitionName: event.competitionName || '',
                isCommentaryOn: event.broadcast?.isCommentaryOn || false
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
            await fetchEventDetails();
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeCommentary = async () => {
        try {
            if (!state.event?.broadcast?.id) return;
            setIsLoading(true);
            setState(prev => ({
                ...prev,
                isCommentaryOn: !prev.isCommentaryOn
            }));
            await gameEvent.changeCommentary(
                state.event.broadcast.id,
                organizationId,
                !state.isCommentaryOn
            );
            await fetchEventDetails();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resume broadcast');
            await fetchEventDetails();
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

    const debouncedUpdate = useCallback(
        debounce((updateData: Partial<EventUpdateRequest>) => {
            handleUpdateEvent(updateData);
        }, 500),
        [handleUpdateEvent]
    );

    const handleHomeTeamNameChange = (text: string) => {
        setState(prev => ({
            ...prev,
            homeTeamName: text
        }));
        debouncedUpdate({ homeTeamName: text });
    };

    // Modify the away team name handler
    const handleAwayTeamNameChange = (text: string) => {
        setState(prev => ({
            ...prev,
            awayTeamName: text
        }));
        debouncedUpdate({ awayTeamName: text });
    };

    // Modify the competition name handler
    const handleCompetitionNameChange = (text: string) => {
        setState(prev => ({
            ...prev,
            competitionName: text
        }));
        debouncedUpdate({ competitionName: text });
    };

    // Modify the picture in picture handler
    const handlePictureInPictureChange = (value: boolean) => {
        setState(prev => ({
            ...prev,
            pictureInPicture: value
        }));
        debouncedUpdate({ isPictureInPicture: value });
    };


    const handleSwitchToMedia = async (mediaId: string) => {
        if (!state.event?.broadcast?.id) return;
        await gameEvent.switchToCommercialMedia(mediaId, state.event?.broadcast?.id, organizationId)
    };

    const renderTabs = () => (
        <View style={styles.tabsContainer}>
            <View style={styles.tabsRow}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'event' && styles.activeTab]}
                    onPress={() => setActiveTab('event')}
                >
                    <Icon
                        name="box"
                        size={18}
                        color={activeTab === 'event' ? colors.tabIndicator : colors.inactiveTab}
                    />
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'event' && styles.activeTabText
                        ]}
                    >
                        Event
                    </Text>
                    {activeTab === 'event' && <View style={styles.activeIndicator} />}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'gameDetails' && styles.activeTab]}
                    onPress={() => setActiveTab('gameDetails')}
                >
                    <Icon
                        name="activity"
                        size={18}
                        color={activeTab === 'gameDetails' ? colors.tabIndicator : colors.inactiveTab}
                    />
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'gameDetails' && styles.activeTabText
                        ]}
                    >
                        Game Details
                    </Text>
                    {activeTab === 'gameDetails' && <View style={styles.activeIndicator} />}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'cameraAndAudio' && styles.activeTab]}
                    onPress={() => setActiveTab('cameraAndAudio')}
                >
                    <Icon
                        name="volume-2"
                        size={18}
                        color={activeTab === 'cameraAndAudio' ? colors.tabIndicator : colors.inactiveTab}
                    />
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'cameraAndAudio' && styles.activeTabText
                        ]}
                    >
                        Camera & Audio
                    </Text>
                    {activeTab === 'cameraAndAudio' && <View style={styles.activeIndicator} />}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
                    onPress={() => setActiveTab('videos')}
                >
                    <Icon
                        name="video"
                        size={18}
                        color={activeTab === 'videos' ? colors.tabIndicator : colors.inactiveTab}
                    />
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'videos' && styles.activeTabText
                        ]}
                    >
                        Videos
                    </Text>
                    {activeTab === 'videos' && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
            </View>
        </View>
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
                {state?.event?.broadcast?.state === 'paused' ? <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleResumeBroadcast}
                >
                    <Icon name="play" size={16} color={colors.white} style={{ marginRight: 8 }} />
                    <Text style={styles.controlButtonText}>Resume</Text>
                </TouchableOpacity> : <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handlePauseBroadcast}
                >
                    <Icon name="pause" size={16} color={colors.white} style={{ marginRight: 8 }} />
                    <Text style={styles.controlButtonText}>Pause</Text>
                </TouchableOpacity>}
                

                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleStopBroadcast}
                    disabled={isLoading}
                >
                    <Icon name="square" size={16} color={colors.white} style={{ marginRight: 8 }} />
                    <Text style={styles.controlButtonText}>Stop</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Starts at</Text>
                <TextInput
                    style={styles.input}
                    value={state.startsAt.toLocaleString()}
                    editable={false}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Ends at</Text>
                <TextInput
                    style={styles.input}
                    value={state.endsAt.toLocaleString()}
                    editable={false}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Stream Key</Text>
                <View style={styles.streamKeyContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        value={state.streamKey}
                        onChangeText={(text) => setState(prev => ({ ...prev, streamKey: text }))}
                    />
                    <TouchableOpacity>
                        <Icon name="copy" size={20} color={colors.textSecondary} style={styles.copyIcon} />
                    </TouchableOpacity>
                </View>
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
                    onChangeText={handleHomeTeamNameChange}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Away Team</Text>
                <TextInput
                    style={styles.textInput}
                    value={state.awayTeamName}
                    onChangeText={handleAwayTeamNameChange}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Competition Name</Text>
                <TextInput
                    style={styles.textInput}
                    value={state.competitionName}
                    onChangeText={handleCompetitionNameChange}
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
                    onValueChange={handlePictureInPictureChange}
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
                    value={state.isCommentaryOn}
                    onValueChange={handleChangeCommentary}
                />
            </View>

            <Text style={styles.autoSaveText}>Changes are saved automatically</Text>
        </View>
    );

    const renderVideosTab = () => (
        <View style={styles.tabContent}>
            {state.event?.media && state.event.media.length > 0 ? (
                <CommercialMediaList media={state.event.media} onPlayMedia={handleSwitchToMedia} />
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
        <SafeAreaView style={styles.viewContainer}>
            <Navbar title={state.title} />
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
        </SafeAreaView>
        
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
    },
    tabsContainer: {
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
        paddingTop: 8,
    },
    tabsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabsScrollContent: {
        paddingHorizontal: 0,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        position: 'relative',
    },
    activeTab: {
        backgroundColor: colors.white,
    },
    tabText: {
        fontSize: 12,
        color: colors.inactiveTab,
        marginTop: 4,
        textAlign: 'center',
    },
    activeTabText: {
        color: colors.tabIndicator,
        fontWeight: '500',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: colors.tabIndicator,
    },
    tabIndicator: {
        height: 1,
        backgroundColor: colors.border,
    },
    content: {
        flex: 1,
    },
    tabContent: {
        padding: 16,
        backgroundColor: colors.cardBackground,
        margin: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    controlButtons: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    controlButton: {
        flex: 1,
        backgroundColor: colors.controlButton,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    controlButtonText: {
        color: colors.white,
        fontSize: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
        backgroundColor: colors.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
        paddingVertical: 8,
    },
    label: {
        color: colors.textSecondary,
        fontSize: 14,
        marginBottom: 4,
    },
    input: {
        fontSize: 16,
        color: colors.text,
        paddingVertical: 4,
        backgroundColor: colors.cardBackground,
    },
    streamKeyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    copyIcon: {
        padding: 8,
    },
    divider: {
        height: 1,
        backgroundColor: colors.divider,
        marginVertical: 8,
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