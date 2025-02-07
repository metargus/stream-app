// src/navigation/types.ts
export type RootStackParamList = {
    Auth: undefined;
    MainApp: undefined;
};

export type AuthStackParamList = {
    SignIn: undefined;
};

export type MainStackParamList = {
    Organizations: undefined;
    OrganizationDetails: { id: string };
    Events: { organizationId: string };
    GameEventDetails: {
        id: string;
        organizationId: string;
        type: string;
    };
};