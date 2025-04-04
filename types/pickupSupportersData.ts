export interface PickupSupportersRootObject extends baseResponse {
    data: Data;
}

interface Data {
    supporters: Supporter[];
    logoImageUrl: string;
    infoText: string;
    infoUrl: string;
    voiceUrl: string;
}

interface Supporter {
    userId?: number;
    supporterName: string;
    message: string;
    contribution: number;
    auxiliary: Auxiliary;
}

interface Auxiliary {
    bgColor?: string;
    instreamStartTime?: number;
    bgVideoPosition?: number;
}