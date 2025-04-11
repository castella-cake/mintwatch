import { IconCrown, IconDeviceTv, IconFileTime, IconFolder, IconHeart, IconHistory, IconSquareLetterN, IconStar, IconUserCheck } from "@tabler/icons-react"
import { ReactNode } from "react"

export type SideMenuItem = {
    label: string
    href: string
    icon?: ReactNode
}

export type SeparatorItem = {
    type: "separator"
}

export const NavigationObject = {
    recommendations: {
        label: "おすすめ動画",
        href: "https://www.nicovideo.jp/recommendations",
        icon: <IconDeviceTv />,
    },
    timeline: {
        label: "フォロー中の新着動画",
        href: "https://www.nicovideo.jp/my/timeline/video",
        icon: <IconUserCheck />,
    },
    mylist: {
        label: "マイリスト",
        href: "https://www.nicovideo.jp/my/mylist",
        icon: <IconFolder />,
    },
    watchLater: {
        label: "あとで見る",
        href: "https://www.nicovideo.jp/my/watchlater",
        icon: <IconFileTime />,
    },
    history: {
        label: "視聴履歴",
        href: "https://www.nicovideo.jp/my/history/video",
        icon: <IconHistory />,
    },
    likeHistory: {
        label: "いいね！履歴",
        href: "https://www.nicovideo.jp/my/history/like",
        icon: <IconHeart />,
    },
    ranking: {
        label: "ランキング",
        href: "https://www.nicovideo.jp/ranking",
        icon: <IconCrown />,
    },
    nAnime: {
        label: "Nアニメ",
        href: "https://anime.nicovideo.jp/free",
        icon: <IconSquareLetterN />,
    },
    premiumOnlyVideos: {
        label: "プレミアム限定動画",
        href: "https://www.nicovideo.jp/tag/プレミアム限定動画",
        icon: <IconStar />,
    },
}