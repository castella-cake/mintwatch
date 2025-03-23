export interface OshiraseBellDataRootObject extends baseResponse {
    data: Data;
}

interface Data {
    newestTimestamp: string;
    badge: boolean;
}