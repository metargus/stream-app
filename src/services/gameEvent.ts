// src/services/gameEvent.ts
import axiosInstance from './api/axiosInstance';
import { GameEvent } from '../types/event';
import { EventUpdateRequest } from '../types/eventUpdate';
import { BroadcastInfo } from '../types/event.ts';

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
        try {
            const response = await axiosInstance.put<GameEvent>(
                `/api/events/game/${id}`,
                request,
                {
                    headers: {
                        'Club-ID': organizationId
                    },
                    params: {
                        type
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
                `/api/broadcasts/${broadcastId}/resume`,
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
                `/api/broadcasts/${broadcastId}/pause`,
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
                `/api/broadcasts/${broadcastId}/stop`,
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

    async switchToCommercialMedia(
        mediaId: string,
        broadcastId: string,
        organizationId: string
    ): Promise<void> {
        try {
            await axiosInstance.post(
                `/api/broadcasts/${broadcastId}/commercial-media/${mediaId}/play`,
                {},
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

    private handleError(error: any): Error {
        if (error.response) {
            return new Error(error.response.data?.message || 'Operation failed');
        }
        return error instanceof Error ? error : new Error('An unknown error occurred');
    }
}

export default GameEventService.getInstance();