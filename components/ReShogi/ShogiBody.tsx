import ShogiContent from "./ShogiContent";

import "./shogiUI.styl"
import { useLocationContext } from "../Router/RouterContext";
import { HistoryAnchor } from "../Router/HistoryAnchor";
import.meta.glob("./styleModules/**/*.styl", {eager: true})

export default function ShogiBody() {
    const location = useLocationContext()
    return (
        <div className="container reshogi-container">
            <div className="shogi-yorokobi-message">
                Welcome to the Project Re:Shogi ranking page!!!!!!
            </div>
            <div className="shogi-type-selector">
                <HistoryAnchor className="shogi-type-selector-button" aria-disabled="true">For who?</HistoryAnchor>
                <HistoryAnchor className="shogi-type-selector-button" data-is-active={location.pathname.replace(/\?.*/, "") === "/ranking"} href="/ranking">メイン</HistoryAnchor>
                <HistoryAnchor className="shogi-type-selector-button" data-is-active={location.pathname.startsWith("/ranking/genre")} href="/ranking/genre">総合ランキング</HistoryAnchor>
            </div>
            <ShogiContent/>
        </div>
    );
}