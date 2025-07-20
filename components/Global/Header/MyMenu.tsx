import { IconChevronRight, IconCoins, IconSettings } from "@tabler/icons-react"
import { useVideoInfoContext } from "../Contexts/VideoDataProvider"
import useServerContext from "@/hooks/serverContextHook"

type link = {
    href: string,
    label: string,
    isFullWidth?: boolean,
}
type links = {
    [key: string]: {
        label?: string,
        links: link[]
    }
}
const myMenuLinks: links = {
    nicovideoMenu: {
        label: "ニコニコ動画メニュー",
        links: [
            {
                href: "https://www.nicovideo.jp/video_top",
                label: "ニコニコ動画TOP"
            },
            {
                href: "https://www.nicovideo.jp/ranking",
                label: "ランキング"
            },
            {
                href: "https://www.nicovideo.jp/my/watchlater",
                label: "あとで見る"
            },
            {
                href: "https://www.nicovideo.jp/my/mylist",
                label: "マイリスト"
            },
            {
                href: "https://www.nicovideo.jp/my/history/video",
                label: "視聴履歴"
            },
            {
                href: "https://www.nicovideo.jp/my/follow",
                label: "フォロー中"
            },
            {
                href: "https://garage.nicovideo.jp/niconico-garage/video/videos/upload",
                label: "動画を投稿する"
            },
            {
                href: "https://blog.nicovideo.jp/niconews/category/videotop/",
                label: "ニコニコインフォ"
            }
        ]
    },
    createMenu: {
        label: "投稿／放送",
        links: [
            {
                href: "https://garage.nicovideo.jp/niconico-garage/video/videos",
                label: "動画"
            },
            {
                href: "https://garage.nicovideo.jp/niconico-garage/live/history",
                label: "生放送"
            },
            {
                href: "https://seiga.nicovideo.jp/my/image",
                label: "イラスト"
            }, 
            {
                href: "https://manga.nicovideo.jp/manga/create",
                label: "マンガ"
            },
            {
                href: "https://namagame.coe.nicovideo.jp/my",
                label: "ニコ生ゲーム"
            },
            {
                href: "https://commons.nicovideo.jp/my/upload",
                label: "コモンズ"
            },
            {
                href: "https://3d.nicovideo.jp/works",
                label: "ニコニ立体"
            },
            {
                href: "https://dic.nicovideo.jp/p/my/rev_list",
                label: "大百科"
            },
            {
                href: "https://q.nicovideo.jp/my",
                label: "ニコニコQ"
            }
        ]
    },
    kokenMenu: {
        links: [
            {
                href: "https://income.nicovideo.jp/",
                label: "クリエイター収入窓口"
            },
            {
                href: "https://koken.nicovideo.jp/creator",
                label: "ニコニ貢献"
            },
            {
                href: "https://creator-support.nicovideo.jp/tool/dashboard",
                label: "クリエイターサポートツール",
                isFullWidth: true,
            },
        ]
    }
}

export default function MyMenu() {
    const { videoInfo } = useVideoInfoContext();
    const contextData = useServerContext();

    const videoViewerInfo = videoInfo?.data.response.viewer;

    const alternativeUserData = contextData && contextData.sessionUser ? {
        nickname: contextData.sessionUser.nickname,
        id: contextData.sessionUser.id,
        isPremium: contextData.sessionUser.type === "premium"
    } : null

    const simplifiedUserData = videoViewerInfo || alternativeUserData || null;

    return (
        <div className="mymenu-container">
            {simplifiedUserData && (
                <a href="https://www.nicovideo.jp/my" className="mymenu-profile">
                    <img
                        src={`https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/${Math.floor(simplifiedUserData.id / 10000)}/${simplifiedUserData.id.toString()}.jpg`}
                        onError={(e: any) => {
                            e.target.src =
                                "https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/defaults/blank.jpg";
                        }}
                        alt="アカウントのアイコン"
                    />
                    <div
                        className="mymenu-profile-name"
                    >
                        <span style={
                            simplifiedUserData.isPremium
                                ? { color: "rgb(217, 163, 0)" }
                                : {}
                        }>
                            {simplifiedUserData.nickname}
                        </span><br/>
                        <span className="mymenu-profile-id">ID: {simplifiedUserData.id}</span>
                    </div>
                    <IconChevronRight/>
                </a>
            )}
            <div className="mymenu-profile-button-container">
                <a href="https://point.nicovideo.jp/index/bank" target="_blank" className="mymenu-point-purchase-link" rel="noreferrer">
                    <IconCoins /> ポイント購入
                </a>
                <a href="https://account.nicovideo.jp/my/account" target="_blank" className="mymenu-account-link" rel="noreferrer">
                    <IconSettings /> アカウント設定
                </a>
            </div>
            {Object.keys(myMenuLinks).map((key) => {
                const thisKey = key as keyof typeof myMenuLinks
                return <div key={`linkarea-${key}`} className="mymenu-linkarea-container">
                    {myMenuLinks[thisKey].label && <h3>{myMenuLinks[thisKey].label}</h3>}
                    <div className="mymenu-links-container">
                        {myMenuLinks[key].links.map((link) => (
                            <a key={`links-${link.label}`}className="mymenu-link" href={link.href} data-is-fullwidth={(link.isFullWidth ?? false).toString()}>{link.label}</a>
                        ))}
                    </div>
                </div>
            })}
        </div>
    );
}