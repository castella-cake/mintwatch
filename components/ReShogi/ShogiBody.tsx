import ShogiContent from "./ShogiContent"

import "./shogiUI.css"
import { useLocationContext } from "../Router/RouterContext"
import { HistoryAnchor } from "../Router/HistoryAnchor"
import { PageTopButton } from "../Global/PageTopButton"
import.meta.glob("./styleModules/**/*.css", { eager: true })

export default function ShogiBody() {
    const location = useLocationContext()
    return (
        <div className="container reshogi-container">
            <div className="shogi-type-selector">
                <HistoryAnchor className="shogi-type-selector-button" data-is-active={location.pathname.startsWith("/ranking/custom")} href="/ranking/custom">カスタムランキング</HistoryAnchor>
                <HistoryAnchor className="shogi-type-selector-button" data-is-active={location.pathname.startsWith("/ranking/genre")} href="/ranking/genre">総合ランキング</HistoryAnchor>
            </div>
            <ShogiContent />
            <PageTopButton isLabelShown={false} isFixed={true} />
        </div>
    )
}
