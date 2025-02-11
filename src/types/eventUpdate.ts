// src/types/eventUpdate.ts
import {BroadcastInfo, CommercialMedia, EventKind, GameEvent} from './event.ts';
import { ytBroadcastDetails } from './youtubeVideo.ts';
import {EventTeam, Team} from "./team.ts";

export interface EventUpdateRequest {
    autoStart: boolean;
    autoStop: boolean;
    awayTeam?: EventTeam;
    homeTeam?: EventTeam;
    awayTeamLogoPreview?: string | null;
    homeTeamLogoPreview?: string | null;

    hasStats: boolean;
    hasSocial: boolean;
    showCards: boolean;
    startDateTime: string;
    endDateTime: string;
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
    eventYTConfig?: ytBroadcastDetails | null;
    
    externalId?: string;
    
    eventTeams: any;
    
    teamIds: string[] | null;
    competitionLogoPreview?: string;
    competitionName?: string;

    courtTopLeftLogoPreview?: string;
    courtTopRightLogoPreview?: string;
    courtBottomLeftLogoPreview?: string;
    courtBottomRightLogoPreview?: string;
    courtCenterLogoPreview?: string;

    uploadedMedias?: Record<string, string>;
    
    gameAnnouncementNHoursBefore?: string | null;
    gameAnnouncementNHoursBeforeHours: string;
    gameAnnouncementNHoursBeforeMins: string;
}

export const createEventUpdateRequest = (event: GameEvent): EventUpdateRequest => {

    const eventTeams = [
        {
            teamId: event.eventTeams?.find(team => team.isHomeTeam)?.teamId || null,
            threeLetterIdentifier: event.eventTeams?.find(team => team.isHomeTeam)?.threeLetterIdentifier || null,
            name: event.eventTeams?.find(team => team.isHomeTeam)?.name || "",
            logoBase64: event.eventTeams?.find(team => team.isHomeTeam)?.logoBase64 || null,
            isHomeTeam: true
        },
        {
            teamId: event.eventTeams?.find(team => !team.isHomeTeam)?.teamId || null,
            threeLetterIdentifier: event.eventTeams?.find(team => !team.isHomeTeam)?.threeLetterIdentifier || null,
            name: event.eventTeams?.find(team => !team.isHomeTeam)?.name || "",
            logoBase64: event.eventTeams?.find(team => !team.isHomeTeam)?.logoBase64 || null,
            isHomeTeam: false
        }
    ];

    const uploadedMedias = event.media?.reduce((acc, media) => ({
        ...acc,
        [media.fileName]: media.id
    }), {}) || {};
    
    return {
        autoStart: event.broadcast?.autoStart || false,
        autoStop: event.broadcast?.autoStop || false,
        awayTeam: event.eventTeams?.find(team => !team.isHomeTeam),
        homeTeam: event.eventTeams?.find(team => team.isHomeTeam),

        awayTeamLogoPreview: event.eventTeams?.find(team => !team.isHomeTeam)?.logoUrl,
        homeTeamLogoPreview: event.eventTeams?.find(team => team.isHomeTeam)?.logoUrl,


        competitionLogoPreview: event.competitionLogo,
        competitionName: event.competitionName,

        courtId: event.court?.id,
        // Court logos
        courtTopLeftLogoPreview: event.broadcast?.courtTopLeftLogo,
        courtTopRightLogoPreview: event.broadcast?.courtTopRightLogo,
        courtBottomLeftLogoPreview: event.broadcast?.courtBottomLeftLogo,
        courtBottomRightLogoPreview: event.broadcast?.courtBottomRightLogo,
        courtCenterLogoPreview: event.broadcast?.courtCenterLogo,

        // DateTime
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        
        hasStats: event.hasStats || false,
        hasSocial: event.hasSocial || false,
        showCards: event.showCards || false,
   
        externalId: event.externalId,
        
        // Teams structure
        teamIds: event.teams?.map(team => team.id) || null,
        eventTeams: eventTeams || [],
        
        // Location details
        place: event.place,
        notes: event.notes,
        
        // Type
        type: event.broadcast?.type,
        
        // Broadcast settings
        isBroadcast: !!event.broadcast?.youtubeStreamKey || !!event.broadcast?.youtubeStreamKey2,
        isRecord: !!event.broadcast?.streamerSaveUrl,
        isCommentaryOn: event.broadcast?.isCommentaryOn || false,
     
        // YouTube configuration
        youtubeStreamKey: event.broadcast?.youtubeStreamKey,
        youtubeStreamKey2: event.broadcast?.youtubeStreamKey2,
        eventYTConfig: event.ytBroadcastDetails || null,
        
        // Media
        uploadedMedias: uploadedMedias,
        
        // Game announcement settings
        isGameAnnouncementEnabled: event.gameAnnouncementEnabled || false,
        gameAnnouncementNHoursBefore: null,
        gameAnnouncementNHoursBeforeHours: "01",
        gameAnnouncementNHoursBeforeMins: "01"
    };
};