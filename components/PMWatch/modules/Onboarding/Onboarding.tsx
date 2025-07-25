import { ReactNode, RefObject } from "react"
import { useSetVideoActionModalStateContext } from "@/components/Global/Contexts/ModalStateProvider"
import SelectButton from "./SelectButton"
import { watchLayoutType } from "../../WatchContent"
import PreviewNewWatch from "@/assets/onboarding/layout_newwatch.svg?react"
import PreviewOldWatch from "@/assets/onboarding/layout_oldwatch.svg?react"
import PreviewShinjukuWatch from "@/assets/onboarding/layout_shinjuku.svg?react"
import PreviewMintPlayer from "@/assets/onboarding/player_mintwatch.svg?react"
import PreviewHTML5Player from "@/assets/onboarding/player_html5.svg?react"
import PreviewShinjukuPlayer from "@/assets/onboarding/player_shinjuku.svg?react"
import PreviewGinzaPlayer from "@/assets/onboarding/player_ginza.svg?react"
import PreviewDefaultComment from "@/assets/onboarding/comment_default.svg?react"
import PreviewModernComment from "@/assets/onboarding/comment_modern.svg?react"

type onboardingPage = {
    title: ReactNode
    description: ReactNode
    selectors?: ReactNode
    hint?: ReactNode
}

/* eslint @stylistic/jsx-closing-tag-location: 0 */
const onboardPages: onboardingPage[] = [
    {
        title: "MintWatch へようこそ",
        description: "現在 MintWatch を使って視聴中です。\nこのポップアップ内で完結する、簡単な初期設定を行ってみませんか？",
    },
    {
        title: "レイアウトを変更する",
        description: "あなたが一番慣れ親しんだレイアウトを使えます。\n設定にはこれ以外にもレイアウトが用意されています。",
        selectors: <>
            <SelectButton title="Re:cresc" value={watchLayoutType.reimaginedOldWatch} storageKey="pmwlayouttype">
                <PreviewOldWatch />
            </SelectButton>
            <SelectButton title="Re:新視聴" value={watchLayoutType.reimaginedNewWatch} storageKey="pmwlayouttype">
                <PreviewNewWatch />
            </SelectButton>
            <SelectButton title="Shinjuku" value={watchLayoutType.shinjuku} storageKey="pmwlayouttype">
                <PreviewShinjukuWatch />
            </SelectButton>
        </>,
        hint: "この設定の変更中、現在視聴中の動画の再生状態がリセットされる場合があります。",
    },
    {
        title: "プレイヤーテーマ",
        description: "自分好みのプレイヤーテーマを使用できます。",
        selectors: <>
            <SelectButton title="MintWatch" value="default" storageKey="pmwplayertype">
                <PreviewMintPlayer />
            </SelectButton>
            <SelectButton title="HTML5" value="html5" storageKey="pmwplayertype">
                <PreviewHTML5Player />
            </SelectButton>
            <SelectButton title="GINZA+" value="ginzaplus" storageKey="pmwplayertype">
                <PreviewGinzaPlayer />
            </SelectButton>
            <SelectButton title="Shinjuku" value="shinjuku" storageKey="pmwplayertype">
                <PreviewShinjukuPlayer />
            </SelectButton>
        </>,
        hint: "Shinjuku レイアウトを選択した場合は、ここでも同じように選択しておくことをおすすめします。",
    },
    {
        title: "コメントリストの表示",
        description: "コメントリストのデザインを選択できます。",
        selectors: <>
            <SelectButton title="eR以前" value="default" storageKey="commentListType">
                <PreviewDefaultComment />
            </SelectButton>
            <SelectButton title="Re:turn以降" value="modern" storageKey="commentListType">
                <PreviewModernComment />
            </SelectButton>
        </>,
    },
    {
        title: "UIの雰囲気を設定",
        description: "UI全体の丸みや余白を一括で自分好みに調整できます。",
        selectors: <>
            <SelectButton title="かため" value="compact" storageKey="layoutDensity" style={{ borderRadius: 4 }}>
            </SelectButton>
            <SelectButton title="ふつう" value="default" storageKey="layoutDensity" style={{ borderRadius: 6, padding: "4px 8px" }}>
            </SelectButton>
            <SelectButton title="やわめ" value="comfort" storageKey="layoutDensity" style={{ borderRadius: 12, padding: "8px 12px" }}>
            </SelectButton>
        </>,
    },
    {
        title: "Thank you!",
        description: "これで初期設定は終了です。\n閉じて視聴を続けるか、「はじめに」を確認することができます。",
        hint: "後でヘッダーのスパナアイコンからさまざまな設定を調整できます。",
    },
]

export function OnboardingPopup({ nodeRef }: { nodeRef: RefObject<HTMLDivElement | null> }) {
    const [pageIndex, setPageIndex] = useState(0)

    const { localStorage, setLocalStorageValue } = useStorageContext()

    const localStorageRef = useRef<any>(null)
    localStorageRef.current = localStorage

    const setVideoActionModalState = useSetVideoActionModalStateContext()

    function writePlayerSettings(name: string, value: any) {
        setLocalStorageValue("playersettings", { ...localStorageRef.current.playersettings, [name]: value })
    }

    const currentPage = onboardPages[pageIndex]

    return (
        <div className="pmw-onboarding-popup-wrapper" ref={nodeRef}>
            <div className="pmw-onboarding-popup">
                <h2>{currentPage.title}</h2>
                <div className="pmw-onboarding-popup-text">
                    {currentPage.description}
                </div>
                { currentPage.selectors && (
                    <div className="pmw-onboarding-popup-childrens">
                        {currentPage.selectors}
                    </div>
                )}
                { currentPage.hint && (
                    <small className="pmw-onboarding-popup-hint">
                        {currentPage.hint}
                    </small>
                )}
                <div className="pmw-onboarding-popup-buttons">
                    <button onClick={() => { writePlayerSettings("onboardingIgnored", true) }} className="pmw-onboarding-popup-close-button">閉じる</button>
                    { pageIndex > 0 && <button className="pmw-onboarding-popup-button-primary" onClick={() => setPageIndex(i => i - 1)}>戻る</button> }
                    { pageIndex === onboardPages.length - 1
                        ? (
                                <button
                                    className="pmw-onboarding-popup-button-primary"
                                    onClick={() => {
                                        setVideoActionModalState("help")
                                        writePlayerSettings("onboardingIgnored", true)
                                    }}
                                >
                                    MintWatch のはじめに
                                </button>
                            )
                        : <button className="pmw-onboarding-popup-button-primary" onClick={() => setPageIndex(i => i + 1)}>次のステップへ</button>}
                </div>
            </div>
        </div>
    )
}
