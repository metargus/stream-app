// src/types/eventUpdate.ts
import { CommercialMedia, GameEvent } from './event.ts';
import { ytBroadcastDetails } from './youtubeVideo.ts';

export interface EventUpdateRequest {
    teamIds?: string[];
    startDateTime: Date;
    endDateTime: Date;
    place?: string;
    courtId?: string;
    notes?: string;
    isGameAnnouncementEnabled: boolean;
    isBroadcast: boolean;
    isRecord: boolean;
    isCommentaryOn: boolean;
    type?: string;
    youtubeStreamKey?: string;
    youtubeStreamKey2?: string;
    eventYTConfig?: ytBroadcastDetails;

    homeTeamName?: string;
    homeTeamLogoPreview?: string;

    awayTeamName?: string;
    awayTeamLogoPreview?: string;

    competitionLogoPreview?: string;
    competitionName?: string;

    courtTopLeftLogoPreview?: string;
    courtTopRightLogoPreview?: string;
    courtBottomLeftLogoPreview?: string;
    courtBottomRightLogoPreview?: string;
    courtCenterLogoPreview?: string;

    uploadedMedias?: CommercialMedia[];

    gameAnnouncementNHoursBefore?: string;
    gameAnnouncementNHoursBeforeHours: string;
    gameAnnouncementNHoursBeforeMins: string;
}

export const createEventUpdateRequest = (event: GameEvent): EventUpdateRequest => {
    return {
        teamIds: event.teams?.map(team => team.id),
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
        place: event.place,
        courtId: event.court?.id,
        notes: event.notes,
        isGameAnnouncementEnabled: false,
        gameAnnouncementNHoursBeforeHours: "01",
        gameAnnouncementNHoursBeforeMins: "01",
        isBroadcast: false,
        isRecord: false,
        isCommentaryOn: false,
        type: event.type.name,
        youtubeStreamKey: event.broadcast?.youtubeStreamKey,
        youtubeStreamKey2: event.broadcast?.youtubeStreamKey2,
        eventYTConfig: event.ytBroadcastDetails,
        homeTeamName: event.homeTeamName,
        awayTeamName: event.awayTeamName,
        homeTeamLogoPreview: event.homeTeamLogo,
        awayTeamLogoPreview: event.awayTeamLogo,
        competitionLogoPreview: event.competitionLogo,
        competitionName: event.competitionName,
        courtTopLeftLogoPreview: event.broadcast?.courtTopLeftLogo,
        courtTopRightLogoPreview: event.broadcast?.courtTopRightLogo,
        courtBottomLeftLogoPreview: event.broadcast?.courtBottomLeftLogo,
        courtBottomRightLogoPreview: event.broadcast?.courtBottomRightLogo,
        courtCenterLogoPreview: event.broadcast?.courtCenterLogo,
        uploadedMedias: event.media,
        gameAnnouncementNHoursBefore: "01"
    };
};

export interface EventUpdate {
    teamIds?: string[];
    startDateTime: Date;
    endDateTime: Date;
    place?: string;
    courtId?: string;
    notes?: string;
    isGameAnnouncementEnabled: boolean;
    isBroadcast: boolean;
    isRecord: boolean;
    isCommentaryOn: boolean;
    type?: string;
    youtubeStreamKey?: string;
    youtubeStreamKey2?: string;
    eventYTConfig?: ytBroadcastDetails;
    homeTeamName?: string;
    homeTeamLogoPreview?: string;
    awayTeamName?: string;
    awayTeamLogoPreview?: string;
    competitionLogoPreview?: string;
    competitionName?: string;
    courtLogos?: {
        topLeft?: string;
        topRight?: string;
        bottomLeft?: string;
        bottomRight?: string;
        center?: string;
    };
    uploadedMedias?: CommercialMedia[];
    gameAnnouncementTiming: {
        hours: string;
        minutes: string;
    };
}