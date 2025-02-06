export interface Event {
    id: string;
    kind: {
        id: string;
        code: string;
        name?: string;
        color?: string;
    };
}