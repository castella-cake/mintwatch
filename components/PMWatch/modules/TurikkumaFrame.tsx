import { ChangeEvent } from "react"
import { CSSTransition } from "react-transition-group"

export function TurikkumaFrame() {
    const { syncStorage, setSyncStorageValue } = useStorageContext()
    const [openMessageShown, setOpenMessageShown] = useState(false)
    const [isRodClicked, setIsRodClicked] = useState(false)
    const rodButtonRef = useRef<HTMLButtonElement>(null)


    const openerInputRef = useRef<HTMLInputElement>(null)

    const handleOpenPortal = useCallback(() => {
        if (!openerInputRef.current) return
        const value = openerInputRef.current.value
        if (value === "つりっくま") {
            setSyncStorageValue("turikkumaPortalOpened", true)
            setOpenMessageShown(true)
            setTimeout(() => setOpenMessageShown(false), 5000)
        }
    }, [])
    return <div className="turikkuma-portal" id="pmw-turikkuma-iframe">
        { openMessageShown && <div className="turikkuma-portal-message">探索力のあるあなたに<strong>「「つりっくま」」</strong>をどうぞ…<br/>(つりっくまのiframe を手に入れました)</div> }
        { syncStorage.turikkumaPortalOpened ? <iframe
            src="https://resource.video.nimg.jp/web/scripts/tsurikkuma/index.html?v=3"
            title="つりっくま"
            width="640"
            height="360"
        >
        </iframe> : <>
            <CSSTransition in={!isRodClicked} timeout={500} nodeRef={rodButtonRef} classNames={"turikkuma-portal-door-transition"} unmountOnExit>
                <button ref={rodButtonRef} className="turikkuma-portal-door" onClick={(e) => {if (e.ctrlKey) {setIsRodClicked(true)}}}>🎣</button>
            </CSSTransition>
            { isRodClicked && <>
                <input className="turikkuma-portal-input" ref={openerInputRef}></input>
                <button className="turikkuma-portal-button" onClick={handleOpenPortal}>ロック解除</button>
            </>}
        </>}
    </div>
}