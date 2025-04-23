export default interface ServerContextRootObject {
    urgentNotice: UrgentNotice;
    i18n: I18n;
    tracking: Tracking;
    serverTime: number;
    publicUrl: PublicUrl;
    sessionUser: SessionUser | null;
    videoTotalSummary: VideoTotalSummary;
    hrc: boolean;
}

interface VideoTotalSummary {
    video: number;
    view: number;
    comment: number;
}

interface SessionUser {
    id: number;
    nickname: string;
    allowSensitiveContents: boolean;
    icons: Icons;
    type: string;
}

interface Icons {
    '50x50': string;
    '150x150': string;
}

interface PublicUrl {
    ads: string;
    adsResource: string;
    channelTool: string;
    auditionApi: string;
    commonHeaderRoot: string;
    commonMuteApi: string;
    creatorSupportFrontend: string;
    feedApi: string;
    follo: string;
    gift: string;
    mjkApi: string;
    nanime: string;
    nicoAccount: string;
    nicoAd: string;
    nicoAdApi: string;
    nicoChannel: string;
    nicoChannelPublicApi: string;
    nicoCommons: string;
    nicoCommonsApi: string;
    nicoDic: string;
    nicoDicApi: string;
    nicoInfo: string;
    nicoKoken: string;
    nicoLive: string;
    nicoLive2: string;
    nicoLiveBroadcast: string;
    nicoNews: string;
    nicoSeiga: string;
    nicoSpweb: string;
    nicoVideo: string;
    nicoVideoEmbed: string;
    nicoVideoExt: string;
    nicoVideoResource: string;
    nvapi: string;
    nvLogger: string;
    qa: string;
    recommendLog: string;
    site: string;
    stella: string;
    sugoiSearchSuggestApi: string;
    upload: string;
    wktk: string;
}

interface Tracking {
    nicosid: string;
}

interface I18n {
    language: string;
    switch: null;
}

interface UrgentNotice {
    uni: null;
    video: null;
}