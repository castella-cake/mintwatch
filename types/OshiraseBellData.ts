export interface OshiraseBellDataRootObject {
    data: Data;
    meta: Meta;
}

interface Meta {
    status: number;
}

interface Data {
    newestTimestamp: string;
    badge: boolean;
}