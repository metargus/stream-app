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
    eventYTConfig?: YouTubeBroadcastInfo;
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