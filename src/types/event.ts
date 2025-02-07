import {EventTeam, Team} from './team';

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

// src/types/event.ts
export interface EventKind {
    id: string;
    code: string;
    name?: string;
    color?: string;
}

export interface BroadcastInfo {
    id: string;
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
    id: string;
    type: EventKind;
    title?: string;
    place?: string;
    notes?: string;
    court?: Court;
    homeTeamName?: string;
    homeTeamLogo?: string;
    awayTeamName?: string;
    awayTeamLogo?: string;
    competitionName?: string;
    competitionLogo?: string;
    broadcast?: BroadcastInfo;
    ytBroadcastDetails?: any;
    media?: any[];
    teams?: Team[];
    eventTeams?: EventTeam[];
    startDateTime: string;
    endDateTime: string;
}

export interface GameEventDetailsState {
    id: string;
    type: string;
    organization: string;

    dataStatus: WorkStatus;
    event?: GameEvent;

    updateStartsAtStatus: WorkStatus;
    startsAt: Date;

    updateEndsAtStatus: WorkStatus;
    endsAt: Date;

    updateStreamKeyStatus: WorkStatus;
    streamKey: string;

    updateHomeTeamNameStatus: WorkStatus;
    homeTeamName: string;

    updateAwayTeamNameStatus: WorkStatus;
    awayTeamName: string;

    updateCompetitionNameStatus: WorkStatus;
    competitionName: string;

    updatePictureInPictureStatus: WorkStatus;
    pictureInPicture: boolean;

    editableSection: 'event' | 'gameDetails' | 'cameraAndAudio' | 'videos';
}