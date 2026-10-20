import { VideoDataErrorRootObject } from "@/types/watch/Base"

export const watchForbiddenTestData: VideoDataErrorRootObject = {
    meta: {
        status: 403,
        code: "FORBIDDEN",
    },
    data: {
        metadata: {
            title: "ニコニコ動画",
            linkTags: [
            ],
            metaTags: [
            ],
            jsonLds: [
            ],
        },
        googleTagManager: {
            user: {
                login_status: "not_login",
            },
        },
        response: {
            statusCode: 403,
            errorCode: "FORBIDDEN",
            reasonCode: "ADMINISTRATOR_DELETE_VIDEO",
            deletedMessage: null,
            publishScheduledAt: null,
            dataSet: null,
        },
        treatAs: false,
    },
}
