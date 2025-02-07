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
    name?: string;
    logoUrl?: string;
    isHomeTeam: boolean;
    logoBase64?: string;
    threeLetterIdentifier: string;
    teamId?: string;
}