// src/services/gameEvent.ts
import axiosInstance from './api/axiosInstance';
import { GameEvent } from '../types/event';
import { EventUpdateRequest } from '../types/eventUpdate';
import { BroadcastInfo, Recording } from '../types/event.ts';
import axios from "axios";

class GameEventService {
    private static instance: GameEventService;

    private constructor() {}

    static getInstance(): GameEventService {
        if (!GameEventService.instance) {
            GameEventService.instance = new GameEventService();
        }
        return GameEventService.instance;
    }

    async getGameEvent(
        id: string,
        kind: string,
        organizationId: string
    ): Promise<GameEvent> {
        try {
            const response = await axiosInstance.get<GameEvent>(`/api/events/game/${id}`, {
                headers: {
                    'Club-ID': organizationId
                },
                params: {
                    kind
                }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateGameEvent(
        id: string,
        type: string,
        organizationId: string,
        request: EventUpdateRequest
    ): Promise<GameEvent> {
        console.log("Request: ",request, type)
        try {
            const response = await axiosInstance.patch<GameEvent>(
                `/api/events/${type}/${id}`,
                request,
                {
                    headers: {
                        'Club-ID': organizationId
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async resumeBroadcast(
        broadcastId: string,
        organizationId: string
    ): Promise<BroadcastInfo> {
        try {
            const response = await axiosInstance.post<BroadcastInfo>(
                `/api/livestreams/${broadcastId}/resume`,
                {},
                {
                    headers: {
                        'Club-ID': organizationId
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async pauseBroadcast(
        broadcastId: string,
        organizationId: string
    ): Promise<BroadcastInfo> {
        try {
            const response = await axiosInstance.post<BroadcastInfo>(
                `/api/livestreams/${broadcastId}/pause`,
                {},
                {
                    headers: {
                        'Club-ID': organizationId
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async stopBroadcast(
        broadcastId: string,
        organizationId: string
    ): Promise<BroadcastInfo> {
        try {
            const response = await axiosInstance.post<BroadcastInfo>(
                `/api/livestreams/${broadcastId}/stop`,
                {},
                {
                    headers: {
                        'Club-ID': organizationId
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async changeCommentary(
        broadcastId: string,
        organizationId: string,
        commentary: boolean
    ): Promise<BroadcastInfo> {
        try {
            const response = await axiosInstance.patch<BroadcastInfo>(
                `/api/livestreams/${broadcastId}/commentary`,
                {on: commentary},
                {
                    headers: {
                        'Club-ID': organizationId
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async switchToCommercialMedia(
        mediaId: string,
        broadcastId: string,
        organizationId: string
    ): Promise<void> {
        try {
            await axiosInstance.get(
                `/api/livestreams/${broadcastId}/switch?switchToMediaId=${mediaId}&orgId=${organizationId}`,
                {
                    headers: {
                        'Club-ID': organizationId
                    }
                }
            );
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async startBroadcast(
        broadcastId: string,
        organizationId: string
    ): Promise<BroadcastInfo> {
        try {
            const response = await axiosInstance.post<BroadcastInfo>(
                `/api/livestreams/${broadcastId}/start`,
                {},
                {
                    headers: {
                        'Club-ID': organizationId
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getEventRecording(
        eventId: string,
        organizationId: string
    ): Promise<Recording> {
        try {
            const response = await axiosInstance.get<Recording>(
                `/api/events/${eventId}/recording`,
                {
                    headers: {
                        'Club-ID': organizationId
                    }
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error?.response?.status === 404) {
                return {link: null, preparing: null, expiresAt: null};
            }
            throw this.handleError(error);        }
    }

    private handleError(error: any): Error {
        if (error.response) {
            return new Error(error.response.data?.message || 'Operation failed');
        }
        return error instanceof Error ? error : new Error('An unknown error occurred');
    }
}

export default GameEventService.getInstance();