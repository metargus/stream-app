export interface Team {
    id: string;
    name?: string;
    logoUrl?: string;
    organizationId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface EventTeam {
    id: string;
    name: string;
    threeLetterIdentifier: string | null;
    logoBase64: string | null;
    logoUrl: string | null;
    isHomeTeam: boolean;
    teamId: string | null;
}