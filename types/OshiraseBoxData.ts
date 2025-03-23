export interface OshiraseBoxRootObject extends baseResponse {
    data: Data;
}

interface Data {
    nextUrl: string;
    importantUnreadCount: number;
    notifications: Notification[];
}

interface Notification {
    id: string;
    read: boolean;
    createdAt: string;
    important: boolean;
    icon: string;
    title: string;
    content?: Content;
    onClick: OnClick;
}

interface OnClick {
    pc: string;
    sp: string;
    internalLink: boolean;
    iosVideo?: string;
    androidVideo?: string;
}

interface Content {
    icon?: string;
    title: string;
}