export interface Organization {
    id: string;
    name?: string;
    logoUrl?: string;
    teams?: Team[];
    scopes?: string[];
    addOns?: string[];
    canFetchRunningBroadcasts: boolean;
}