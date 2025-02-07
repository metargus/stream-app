//src/services/event.ts
import axiosInstance from './api/axiosInstance.ts';
import axios from "axios";
import { GameEvent } from '../types/event';

class EventService {
    private static instance: EventService;

    private constructor() {}

    static getInstance(): EventService {
        if (!EventService.instance) {
            EventService.instance = new EventService();
        }
        return EventService.instance;
    }

    async getGameEvents(
        organizationId: string,
        startsAt: Date,
        endsAt: Date
    ): Promise<GameEvent[]> {
        try {
            const response = await axiosInstance.get<GameEvent[]>('/api/events/games', {
                params: {
                    orgId: organizationId,
                    StartAfter: startsAt.toISOString(),
                    EndBefore: endsAt.toISOString()
                },
                headers: {
                    'Club-ID': organizationId
                }
            });
            console.log(response);
            return response.data.sort((a, b) =>
                new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
            );
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getRunningBroadcasts(organizationId: string): Promise<GameEvent[]> {
        try {
            const response = await axiosInstance.get<GameEvent[]>('/api/events/running-broadcasts', {
                params: {
                    clubId: organizationId
                },
                headers: {
                    'Club-ID': organizationId
                }
            });
            return response.data.sort((a, b) =>
                new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
            );
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private handleError(error: any): Error {
        if (axios.isAxiosError(error)) {
            return new Error(error.response?.data?.message || 'Failed to fetch events');
        }
        return error instanceof Error ? error : new Error('An unknown error occurred');
    }
}

export default EventService.getInstance();