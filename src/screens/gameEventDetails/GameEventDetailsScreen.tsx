// src/screens/GameEventDetails/GameEventDetailsScreen.tsx
import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Switch,
    StyleSheet,
    ActivityIndicator, SafeAreaView, Alert, Linking,
} from 'react-native';
import RNFS from 'react-native-fs';
import { Platform, PermissionsAndroid } from 'react-native';
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
        recording: null,
        type: '',
        title: '',
        organization: '',

        teams: [],
        eventTeams: [],
        
        externalId: '',

        hasRecording: false,
        hasStats: false,
        hasSocial: true,
        showCards: false,

        isBroadcast: false,
        isRecord: false,
        isCommentaryOn: false,
        autoStart: false,
        autoStop: false,

        homeTeamName: '',
        awayTeamName: '',
        competitionName: '',

        isGameAnnouncementEnabled: false,
        gameAnnouncementNHoursBeforeHours: "01",
        gameAnnouncementNHoursBeforeMins: "01",

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
        pictureInPicture: false,
        editableSection: 'event',
        uploadedMedias: []
    });
    const route = useRoute<RouteProp<MainStackParamList, 'GameEventDetails'>>();
    const { id, organizationId, type } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
    const [stopPollingInterval, setStopPollingInterval] = useState<NodeJS.Timeout | null>(null);


    useEffect(() => {
        fetchEventDetails();
    }, []);

    const checkPermission = async () => {
        if (Platform.OS === 'ios') {
            return true;
        }

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
                {
                    title: 'Storage Permission Required',
                    message: 'App needs access to your storage to download the recording',
                    buttonPositive: 'OK',
                    buttonNegative: 'Cancel',
                    buttonNeutral: 'Ask Me Later',
                }
            );


            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                Alert.alert(
                    "Permission Denied",
                    "Storage permission is permanently denied. Please enable it from settings.",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Open Settings",
                            onPress: () => Linking.openSettings(),
                        }
                    ]
                );
                return false;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    };

    const downloadRecording = async (url: string) => {
        const granted = await checkPermission();
        if (!granted) return;

        const fileName = `recording_${Date.now()}.mp4`;
        const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

        try {
            const options = {
                fromUrl: url,
                toFile: path,
                background: true,
                beginOnWifiReady: true,
                progressDivider: 1
            };

            const download = RNFS.downloadFile(options);
            const result = await download.promise;

            if (result.statusCode === 200) {
                Alert.alert('Success', 'Recording downloaded successfully');
            }
        } catch (error) {
            console.error('Download failed:', error);
        }
    };
    const fetchEventDetails = async () => {
        try {
            setIsLoading(true);
            const event = await gameEvent.getGameEvent(id, type, organizationId);
            const recording = event.hasRecording ? await gameEvent.getEventRecording(id, organizationId) : null;

            setState(prev => ({
                ...prev,
                id: event.id,
                event,
                recording,
                externalId: event.externalId,
                teams: event.teams || [],
                eventTeams: event.eventTeams || [],
                hasRecording: event.hasRecording || false,
                hasStats: event.hasStats || false,
                hasSocial: event.hasSocial || true,
                showCards: event.showCards || false,
                title: event.title,
                place: event.place,
                courtId: event.court?.id,
                notes: event.notes,
                startsAt: new Date(event.startDateTime),
                endsAt: new Date(event.endDateTime),
                streamKey: event.broadcast?.youtubeStreamKey || '',
                homeTeamName: event.eventTeams?.find(team => team.isHomeTeam)?.name || '',
                awayTeamName: event.eventTeams?.find(team => !team.isHomeTeam)?.name || '',
                competitionName: event.competitionName || '',
                isBroadcast: !!event.broadcast,
                isRecord: !!event.broadcast?.streamerSaveUrl,
                isCommentaryOn: event.broadcast?.isCommentaryOn || false,
                autoStart: event.broadcast?.autoStart || false,
                autoStop: event.broadcast?.autoStop || false,
                youtubeStreamKey: event.broadcast?.youtubeStreamKey,
                youtubeStreamKey2: event.broadcast?.youtubeStreamKey2,
                eventYTConfig: event.ytBroadcastDetails,
                competitionLogoPreview: event.competitionLogo,
                courtTopLeftLogoPreview: event.broadcast?.courtTopLeftLogo,
                courtTopRightLogoPreview: event.broadcast?.courtTopRightLogo,
                courtBottomLeftLogoPreview: event.broadcast?.courtBottomLeftLogo,
                courtBottomRightLogoPreview: event.broadcast?.courtBottomRightLogo,
                courtCenterLogoPreview: event.broadcast?.courtCenterLogo,
                uploadedMedias: event.media,
                isGameAnnouncementEnabled: event.gameAnnouncementEnabled || false,
                gameAnnouncementNHoursBefore: event.gameAnnouncementNHoursBefore || "01"
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

    const handleStartLive = async () => {
        try {
            if (!state.event?.broadcast?.id) return;
            setIsLoading(true);
            await gameEvent.startBroadcast(
                state.event.broadcast.id,
                organizationId
            );
            await fetchEventDetails();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start broadcast');
        } finally {
            setIsLoading(false);
        }
    }


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

    const handleHomeTeamNameBlur = () => {
        if (!state.event) return;

        // Create deep copy of event teams
        const updatedEventTeams = state.event.eventTeams?.map(team => ({
            ...team,
            name: team.isHomeTeam ? state.homeTeamName : team.name
        }));

        handleUpdateEvent({
            eventTeams: updatedEventTeams
        });
    };


    const handleAwayTeamNameBlur = () => {
        if (!state.event) return;

        // Create deep copy of event teams
        const updatedEventTeams = state.event.eventTeams?.map(team => ({
            ...team,
            // Update name only for away team
            name: !team.isHomeTeam ? state.awayTeamName : team.name
        }));

        handleUpdateEvent({
            eventTeams: updatedEventTeams
        });
    };

    const handleCompetitionNameBlur = () => {
        handleUpdateEvent({
            competitionName: state.competitionName,
        });
    };

    // Modify the picture in picture handler
    const handlePictureInPictureChange = (value: boolean) => {
        setState(prev => ({
            ...prev,
            pictureInPicture: value
        }));
    };

    const formatDateTime = (date: Date): string => {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };


    const handleSwitchToMedia = async (mediaId: string) => {
        if (!state.event?.broadcast?.id) return;
        await gameEvent.switchToCommercialMedia(mediaId, state.event?.broadcast?.id, organizationId)
    };
    
    const isFinished = state.event?.broadcast?.state === "finished";

    const isCreating = state.event?.broadcast?.state === 'creating';

    const isDeleting = state.event?.broadcast?.state === 'deleting';


    useEffect(() => {
        if (isCreating) {
            const interval = setInterval(() => {
                fetchEventDetails();
            }, 60000); 
            setPollingInterval(interval);
        } else {
            // Clear polling if not creating
            if (pollingInterval) {
                clearInterval(pollingInterval);
                setPollingInterval(null);
            }
        }

        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [state.event?.broadcast?.state]);

    useEffect(() => {
        if (isDeleting) {
            const interval = setInterval(() => {
                fetchEventDetails();
            }, 30000);
            setStopPollingInterval(interval);
        } else {
            // Clear polling if not creating
            if (stopPollingInterval) {
                clearInterval(stopPollingInterval);
                setStopPollingInterval(null);
            }
        }

        return () => {
            if (stopPollingInterval) {
                clearInterval(stopPollingInterval);
            }
        };
    }, [state.event?.broadcast?.state]);


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
            {!isFinished && (
                <View style={styles.controlButtons}>
                    {state?.event?.broadcast?.state === 'scheduled' ? (
                            <TouchableOpacity
                            style={styles.startLiveButton}
                            onPress={handleStartLive}
                            disabled={isLoading || isFinished || isCreating || isDeleting}
                        >
                            <Icon name="radio" size={16} color='#FF3B30' style={{ marginRight: 8 }} />
                            <Text style={styles.startLiveText}>Start Live</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            {state?.event?.broadcast?.state === 'paused' ? (
                                <TouchableOpacity
                                    style={[
                                        styles.controlButton,
                                        (isLoading || isFinished || isCreating || isDeleting) && styles.disabledButton
                                    ]}
                                    onPress={handleResumeBroadcast}
                                    disabled={isLoading || isFinished || isCreating || isDeleting}
                                >
                                    <Icon name="play" size={16} color={colors.white} style={{ marginRight: 8 }} />
                                    <Text style={styles.controlButtonText}>Resume</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[
                                        styles.controlButton,
                                        (isLoading || isFinished || isCreating || isDeleting) && styles.disabledButton
                                    ]}
                                    onPress={handlePauseBroadcast}
                                    disabled={isLoading || isFinished || isCreating || isDeleting}
                                >
                                    <Icon name="pause" size={16} color={colors.white} style={{ marginRight: 8 }} />
                                    <Text style={styles.controlButtonText}>Pause</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[
                                    styles.controlButton,
                                    (isLoading || isFinished || isCreating || isDeleting) && styles.disabledButton
                                ]}
                                onPress={handleStopBroadcast}
                                disabled={isLoading || isFinished || isCreating || isDeleting}
                            >
                                <Icon name="square" size={16} color={colors.white} style={{ marginRight: 8 }} />
                                <Text style={styles.controlButtonText}>Stop</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}
            {isCreating && (
                <View style={styles.creatingStateContainer}>
                    <Text style={styles.creatingStateText}>The stream is starting</Text>
                    <ActivityIndicator size="small" color={colors.controlButton} style={styles.creatingStateLoader} />
                </View>
            )}

            {isDeleting && (
                <View style={styles.creatingStateContainer}>
                    <Text style={styles.creatingStateText}>The stream is stopping</Text>
                    <ActivityIndicator size="small" color={colors.controlButton} style={styles.creatingStateLoader} />
                </View>
            )}


            <View style={styles.inputGroup}>
                <Text style={styles.label}>Starts at</Text>
                <TextInput
                    style={[styles.input, isFinished && styles.disabledInput]}
                    value={formatDateTime(state.startsAt)}
                    editable={false}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Ends at</Text>
                <TextInput
                    style={[styles.input, isFinished && styles.disabledInput]}
                    value={formatDateTime(state.endsAt)}
                    editable={false}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Stream Key</Text>
                <View style={styles.streamKeyContainer}>
                    <Text
                        style={[styles.input, { flex: 1 }, isFinished && styles.disabledInput]}
                    >
                        {state.streamKey}
                    </Text>
                </View>
            </View>

            {state.recording && !state.recording?.preparing && (
                <View style={styles.downloadContainer}>
                    <TouchableOpacity
                        style={styles.downloadButton}
                        onPress={() => { 
                            state.recording?.link && downloadRecording(state.recording?.link)}
                        }
                    >
                        <Icon name="download" size={16} color={colors.primary} style={{ marginRight: 8 }} />
                        <Text style={styles.downloadButtonText}>Download Recording</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    const renderGameDetailsTab = () => (
        <View style={styles.tabContent}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Home Team</Text>
                <TextInput
                    style={[styles.textInput, (isLoading || isFinished || isCreating || isDeleting) && styles.disabledInput]}
                    value={state.homeTeamName}
                    onChangeText={(text) => setState(prev => ({
                        ...prev,
                        homeTeamName: text
                    }))}
                    onBlur={handleHomeTeamNameBlur}
                    editable={!isLoading && !isFinished && !isCreating && !isDeleting}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Away Team</Text>
                <TextInput
                    style={[styles.textInput, (isLoading || isFinished || isCreating || isDeleting) && styles.disabledInput]}
                    value={state.awayTeamName}
                    onChangeText={(text) => setState(prev => ({
                        ...prev,
                        awayTeamName: text
                    }))}
                    onBlur={handleAwayTeamNameBlur}
                    editable={!isLoading && !isFinished && !isCreating && !isDeleting}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Competition Name</Text>
                <TextInput
                    style={[styles.textInput, (isLoading || isFinished || isCreating || isDeleting) && styles.disabledInput]}
                    value={state.competitionName}
                    onChangeText={(text) => setState(prev => ({
                        ...prev,
                        competitionName: text
                    }))}
                    onBlur={handleCompetitionNameBlur}
                    editable={!isLoading && !isFinished && !isCreating && !isDeleting}
                />
            </View>
        </View>
    );


    const renderCameraAndAudioTab = () => (
        <View style={styles.tabContent}>
            {/*<View style={styles.toggleContainer}>*/}
            {/*    <Text style={styles.toggleLabel}>Picture in Picture</Text>*/}
            {/*    <Switch*/}
            {/*        value={state.pictureInPicture}*/}
            {/*        onValueChange={handlePictureInPictureChange}*/}
            {/*    />*/}
            {/*</View>*/}
            
            {/*<View style={styles.toggleContainer}>*/}
            {/*    <Text style={styles.toggleLabel}>Pan & Zoom</Text>*/}
            {/*    <Switch*/}
            {/*        value={false}*/}
            {/*        onValueChange={() => {}}*/}
            {/*    />*/}
            {/*</View>*/}

            <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Commentary</Text>
                <Switch
                    value={state.isCommentaryOn}
                    onValueChange={handleChangeCommentary}
                    disabled={isLoading || isFinished || isCreating || isDeleting}
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
    },
    disabledButton: {
        opacity: 0.5,
    },
    disabledInput: {
        opacity: 0.7,
        backgroundColor: colors.background,
    },
    startLiveButton: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    startLiveText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
    },
    creatingStateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 8,
    },
    creatingStateText: {
        textAlign: 'center',
        fontSize: 14,
        color: colors.text,
    },
    creatingStateLoader: {
        marginLeft: 8,
    },
    downloadContainer: {
        marginBottom: 16,
        paddingVertical: 8,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: colors.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    downloadButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '500',
    }
})