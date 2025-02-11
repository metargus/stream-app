import {Organization} from '../types/organization';
import axiosInstance from './api/axiosInstance.ts';
import axios from 'axios';

class OrganizationService {
    private static instance: OrganizationService;

    private constructor() {}

    static getInstance(): OrganizationService {
        if (!OrganizationService.instance) {
            OrganizationService.instance = new OrganizationService();
        }
        return OrganizationService.instance;
    }

    async getOrganizations(): Promise<Organization[]> {
        try {
            const response = await axiosInstance.get<Organization[]>('/api/clubs');
            return response.data.filter(item => item.scopes?.includes("Livestream"));
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private handleError(error: any): Error {
        if (axios.isAxiosError(error)) {
            return new Error(error.response?.data?.message || 'Failed to fetch organizations');
        }
        return error instanceof Error ? error : new Error('An unknown error occurred');
    }
}

export default OrganizationService.getInstance();