import { useTransitionState } from "react-transition-state"

export function TurikkumaFrame() {
    const syncStorage = useStorageVar(["turikkumaPortalOpened"] as const)
    const [openMessageShown, setOpenMessageShown] = useState(false)
    const [isRodClicked, setIsRodClicked] = useState(false)
    const rodButtonRef = useRef<HTMLButtonElement>(null)

    const isRodButtonOpen = !isRodClicked
    const [{ status: rodButtonStatus, isMounted: isRodButtonMounted }, toggleRodButton] = useTransitionState({
        timeout: 500,
        mountOnEnter: true,
        unmountOnExit: true,
        preEnter: true,
        initialEntered: isRodButtonOpen,
    })
    useEffect(() => {
        toggleRodButton(isRodButtonOpen)
    }, [isRodButtonOpen])

    const openerInputRef = useRef<HTMLInputElement>(null)

    const handleOpenPortal = useCallback(() => {
        if (!openerInputRef.current) return
        const value = openerInputRef.current.value
        if (value === "つりっくま") {
            storage.setItem("sync:turikkumaPortalOpened", true)
            setOpenMessageShown(true)
            setTimeout(() => setOpenMessageShown(false), 5000)
        }
    }, [])
    return (
        <div className="turikkuma-portal" id="pmw-turikkuma-iframe">
            { openMessageShown && (
                <div className="turikkuma-portal-message">
                    探索力のあるあなたに
                    <strong>「「つりっくま」」</strong>
                    をどうぞ…
                    <br />
                    (つりっくまのiframe を手に入れました)
                </div>
            ) }
            { syncStorage.turikkumaPortalOpened
                ? (
                        <iframe
                            src="https://resource.video.nimg.jp/web/scripts/tsurikkuma/index.html?v=3"
                            title="つりっくま"
                            width="640"
                            height="360"
                        >
                        </iframe>
                    )
                : (
                        <>
                            { isRodButtonMounted && (
                                <button
                                    ref={rodButtonRef}
                                    className="turikkuma-portal-door"
                                    data-animation={rodButtonStatus}
                                    onClick={(e) => {
                                        if (e.ctrlKey) {
                                            setIsRodClicked(true)
                                        }
                                    }}
                                >
                                    🎣
                                </button>
                            ) }
                            { isRodClicked && (
                                <>
                                    <input className="turikkuma-portal-input" ref={openerInputRef}></input>
                                    <button className="turikkuma-portal-button" onClick={handleOpenPortal}>ロック解除</button>
                                </>
                            )}
                        </>
                    )}
        </div>
    )
}
