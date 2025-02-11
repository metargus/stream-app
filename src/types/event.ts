import {EventTeam, Team} from './team';
import {ytBroadcastDetails} from "./youtubeVideo.ts";

export type BroadcastState =
    | 'scheduled'
    | 'creating'
    | 'running'
    | 'finished'
    | 'paused'
    | 'cancelled'
    | 'errored'
    | 'deleting';

export type BroadcastKind = 'full' | 'lite' | 'panoramic';

export interface CommercialMedia {
    id: string;
    fileName?: string;
    url?: string;
    type?: string;
    duration?: number;
    size?: number;
    uploadedAt?: string;
}

export interface WorkStatus {
    isExecuting: boolean;
    error?: Error | null;
    hasError: boolean;
}

export interface Recording {
    link?: string | null;
    expiresAt?: string | null;
    preparing?: boolean | null;
}

export interface EventKind {
    id: string;
    code: string;
    name?: string;
    color?: string;
}

export interface Court {
    id: string;
    name?: string;
}

export interface BroadcastInfo {
    id: string;
    autoStart?: boolean;
    autoStop?: boolean;
    title?: string;
    streamerInputUrl?: string;
    youtubeStreamKey?: string;
    youtubeStreamKey2?: string;
    state?: BroadcastState;
    courtTopLeftLogo?: string;
    courtTopRightLogo?: string;
    courtBottomLeftLogo?: string;
    courtBottomRightLogo?: string;
    courtCenterLogo?: string;
    type?: BroadcastKind;
    saveType?: string;
    streamerSaveUrl?: string;
    isCommentaryOn: boolean;
    activeVideo?: string;
}

export interface Court {
    id: string;
    name?: string;
}

export interface GameEvent {
    // Base fields
    id: string;
    startDateTime: string;
    endDateTime: string;
    title?: string;

    // Recording and stats
    hasRecording: boolean;
    hasStats: boolean;
    hasSocial: boolean;
    showCards: boolean;
    externalId?: string;

    // Type and location
    type: EventKind;
    place?: string;
    notes?: string;
    court?: Court;

    // Teams and participants
    teams?: Team[];
    eventTeams?: EventTeam[];

    // Competition details
    competitionName?: string;
    competitionLogo?: string;

    // Broadcast and media
    broadcast?: BroadcastInfo;
    ytBroadcastDetails?: ytBroadcastDetails; 
    media?: any[];

    // Game announcement settings
    gameAnnouncementNHoursBefore?: string;
    gameAnnouncementEnabled: boolean;
}

export interface GameEventDetailsState {
    // Base fields
    id: string;
    recording: Recording | null;
    type: string;
    title?: string;
    organization: string;

    // Event status fields
    dataStatus: WorkStatus;
    event?: GameEvent;
    
    externalId?: string;

    // Teams & Event Teams
    teams?: Team[];
    eventTeams?: EventTeam[];

    // Event details
    hasRecording: boolean;
    hasStats: boolean;
    hasSocial: boolean;
    showCards: boolean;
    place?: string;
    courtId?: string;
    notes?: string;

    // Broadcast settings
    isBroadcast: boolean;
    isRecord: boolean;
    isCommentaryOn: boolean;
    autoStart: boolean;
    autoStop: boolean;

    // YouTube configuration
    youtubeStreamKey?: string;
    youtubeStreamKey2?: string;
    eventYTConfig?: ytBroadcastDetails;

    // Team names and logos
    homeTeamName: string;
    awayTeamName: string;
    homeTeamLogoPreview?: string;
    awayTeamLogoPreview?: string;

    // Competition details
    competitionName: string;
    competitionLogoPreview?: string;

    // Court logos
    courtTopLeftLogoPreview?: string;
    courtTopRightLogoPreview?: string;
    courtBottomLeftLogoPreview?: string;
    courtBottomRightLogoPreview?: string;
    courtCenterLogoPreview?: string;

    // Media
    uploadedMedias?: CommercialMedia[];

    // Game announcement settings
    isGameAnnouncementEnabled: boolean;
    gameAnnouncementNHoursBefore?: string;
    gameAnnouncementNHoursBeforeHours: string;
    gameAnnouncementNHoursBeforeMins: string;

    // Update statuses
    updateStartsAtStatus: WorkStatus;
    updateEndsAtStatus: WorkStatus;
    updateStreamKeyStatus: WorkStatus;
    updateHomeTeamNameStatus: WorkStatus;
    updateAwayTeamNameStatus: WorkStatus;
    updateCompetitionNameStatus: WorkStatus;
    updatePictureInPictureStatus: WorkStatus;

    // Dates
    startsAt: Date;
    endsAt: Date;
    streamKey: string;

    // UI state
    pictureInPicture: boolean;
    editableSection: 'event' | 'gameDetails' | 'cameraAndAudio' | 'videos';
}