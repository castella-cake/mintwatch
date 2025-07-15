import { ReactNode, RefObject } from "react";
import { useSetVideoActionModalStateContext } from "@/components/Global/Contexts/ModalStateProvider";
import SelectButton from "./SelectButton";
import { watchLayoutType } from "../../WatchContent";

type onboardingPage = {
    title: ReactNode;
    description: ReactNode;
    selectors?: ReactNode;
    hint?: ReactNode;
}

const onboardPages: onboardingPage[] = [
    {
        title: "MintWatch へようこそ",
        description: "現在 MintWatch を使って視聴中です。\nこのポップアップ内で簡単な設定を行ってみませんか？",
    },
    {
        title: "レイアウトを変更する",
        description: "あなたが一番慣れ親しんだレイアウトを使えます。\n設定にはこれ以外にもレイアウトが用意されています。",
        selectors: <>
            <SelectButton title="Re:cresc" value={watchLayoutType.reimaginedOldWatch} storageKey="pmwlayouttype">
            </SelectButton>
            <SelectButton title="Re:新視聴" value={watchLayoutType.reimaginedNewWatch} storageKey="pmwlayouttype">
            </SelectButton>
            <SelectButton title="Shinjuku" value={watchLayoutType.shinjuku} storageKey="pmwlayouttype">
            </SelectButton>
        </>,
        hint: "この設定の変更中、現在視聴中の動画の再生状態がリセットされる可能性があります。"
    },
    {
        title: "プレイヤーテーマ",
        description: "自分好みのプレイヤーテーマを使用できます。",
        selectors: <>
            <SelectButton title="MintWatch" value={"default"} storageKey="pmwplayertype">
            </SelectButton>
            <SelectButton title="HTML5" value={"html5"} storageKey="pmwplayertype">
            </SelectButton>
            <SelectButton title="Shinjuku" value={"shinjuku"} storageKey="pmwplayertype">
            </SelectButton>
            <SelectButton title="GINZA+" value={"ginzaplus"} storageKey="pmwplayertype">
            </SelectButton>
        </>,
        hint: "前に「Shinjuku」レイアウトを選択した場合は、ここでも「Shinjuku」にしておくことをおすすめします。"
    },
    {
        title: "コメントリストの表示",
        description: "再デザイン後に準拠したコメントリストを使用できます。",
        selectors: <>
            <SelectButton title="eR以前" value={"default"} storageKey="commentListType">
            </SelectButton>
            <SelectButton title="Re:turn" value={"modern"} storageKey="commentListType">
            </SelectButton>
        </>
    },
    {
        title: "UIの雰囲気を設定",
        description: "UI全体の丸みや余白を一括で自分好みに調整できます。",
        selectors: <>
            <SelectButton title="かため" value={"compact"} storageKey="layoutDensity">
            </SelectButton>
            <SelectButton title="ふつう" value={"default"} storageKey="layoutDensity">
            </SelectButton>
            <SelectButton title="やわめ" value={"comfort"} storageKey="layoutDensity">
            </SelectButton>
        </>
    },
    {
        title: "完了しました",
        description: "これで初期設定は終了です。\nこれ以外にも、さまざまな設定をヘッダーのスパナアイコンから調整できます。\n「はじめに」を確認しておくことをおすすめします。"
    }
]

export function OnboardingPopup({ nodeRef }: { nodeRef: RefObject<HTMLDivElement | null> }) {
    const [pageIndex, setPageIndex] = useState(0)

    const { localStorage, setLocalStorageValue} = useStorageContext()

    const localStorageRef = useRef<any>(null)
    localStorageRef.current = localStorage

    const setVideoActionModalState = useSetVideoActionModalStateContext()

    function writePlayerSettings(name: string, value: any) {
        setLocalStorageValue("playersettings", { ...localStorageRef.current.playersettings, [name]: value })
    }

    const currentPage = onboardPages[pageIndex];

    return <div className="pmw-onboarding-popup-wrapper" ref={nodeRef}>
        <div className="pmw-onboarding-popup">
            <h2>{currentPage.title}</h2>
            <div className="pmw-onboarding-popup-text">
                {currentPage.description}
            </div>
            { currentPage.selectors && <div className="pmw-onboarding-popup-childrens">
                {currentPage.selectors}
            </div>}
            { currentPage.hint && <small className="pmw-onboarding-popup-hint">
                {currentPage.hint}
            </small>}
            <div className="pmw-onboarding-popup-buttons">
                <button onClick={() => {writePlayerSettings("onboardingIgnored", true)}} className="pmw-onboarding-popup-close-button">閉じる</button>
                { pageIndex > 0 && <button className="pmw-onboarding-popup-button-primary" onClick={() => setPageIndex(i => i - 1)}>戻る</button> }
                { pageIndex === onboardPages.length - 1 ? 
                    <button className="pmw-onboarding-popup-button-primary" onClick={() => {setVideoActionModalState("help");writePlayerSettings("onboardingIgnored", true)}}>MintWatch のはじめに</button> :
                    <button className="pmw-onboarding-popup-button-primary" onClick={() => setPageIndex(i => i + 1)}>次のステップへ</button>
                }
            </div>
        </div>
    </div>
}