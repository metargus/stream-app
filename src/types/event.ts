import { Team } from './team';

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
    state?: 'scheduled' | 'creating' | 'running' | 'finished' | 'paused' | 'cancelled' | 'errored' | 'deleting';
    courtTopLeftLogo?: string;
    courtTopRightLogo?: string;
    courtBottomLeftLogo?: string;
    courtBottomRightLogo?: string;
    courtCenterLogo?: string;
    type?: string;
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
    youTubeBroadcastInfo?: any;
    media?: any[];
    teams?: Team[];
    startDateTime: string;
    endDateTime: string;
}