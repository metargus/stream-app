// src/types/youTubeVideo.ts
export interface YouTubeVideoId {
    rawValue: string;
}

export type PlayerOption =
    | { type: 'autoplay'; value: boolean }
    | { type: 'controls'; value: boolean }
    | { type: 'enableJsAPI'; value: boolean }
    | { type: 'fullscreen'; value: boolean }
    | { type: 'playsInline'; value: boolean };

export interface YouTubeVideo {
    id: YouTubeVideoId;
}

export const getPlayerOptionKey = (option: PlayerOption): string => {
    switch (option.type) {
        case 'autoplay':
            return 'autoplay';
        case 'controls':
            return 'controls';
        case 'enableJsAPI':
            return 'enablejsapi';
        case 'fullscreen':
            return 'fs';
        case 'playsInline':
            return 'playsinline';
    }
};

export const getPlayerOptionValue = (option: PlayerOption): number => {
    return option.value ? 1 : 0;
};

export const convertOptionsToParams = (options: PlayerOption[]): Record<string, number> => {
    return options.reduce((acc, option) => {
        acc[getPlayerOptionKey(option)] = getPlayerOptionValue(option);
        return acc;
    }, {} as Record<string, number>);
};

export interface ytBroadcastDetails {
    broadcastId?: string;      
    broadcastTitle?: string;   
    visibility?: string;
    broadcastUrl?: string;     
    thumbnailUrl?: string;    
}