export interface OshiraseBoxRootObject {
    data: Data;
    meta: Meta;
}

interface Meta {
    status: number;
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