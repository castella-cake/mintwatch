import { useEffect, useState } from "react"
import type { RefObject } from "react"
import Hls, { Level } from "hls.js"

type QualitySelectProps = {
    hlsRef: RefObject<Hls>
    qualityLabels?: string[]
}

/**
 * 画質選択セレクトボックス
 * hlsLevel / hlsLevelList の購読を内部に持つことで、画質切替のたびに再レンダリングされるのはこのコンポーネントのみになる
 *
 * 注意: このコンポーネントは memo 化しないこと
 * hlsRef.current はマウント後に useHls 内で設定されるため、親の再レンダリングに追随して
 * hlsRef.current の変化を検知する必要がある
 */
export function QualitySelect({ hlsRef, qualityLabels }: QualitySelectProps) {
    const [hlsLevelList, setHlsLevelList] = useState<Level[]>([])
    const [hlsLevel, setHlsLevel] = useState(0)

    useEffect(() => {
        if (!hlsRef.current) return
        setHlsLevelList(hlsRef.current.levels)
        hlsRef.current.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
            setHlsLevel(data.level)
        })
        hlsRef.current.on(Hls.Events.LEVELS_UPDATED, (event, data) => {
            setHlsLevelList(data.levels)
        })
        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
            setHlsLevelList(data.levels)
        })
    }, [hlsRef.current])

    return hlsRef.current
        ? (
                <select
                    onChange={(e) => {
                        if (!hlsRef.current) return
                        hlsRef.current.currentLevel = Number(e.currentTarget.value)
                        storage.setItem("local:preferredLevel", Number(e.currentTarget.value))
                    }}
                    value={hlsLevel}
                    className="playercontroller-qualityselect"
                    aria-label="画質選択"
                    title="画質選択"
                    id="pmw-qualityselector"
                >
                    {hlsLevelList.map((elem, index) => {
                        return <option value={index} key={index}>{(qualityLabels && qualityLabels[index]) || `${elem.height}p`}</option>
                    })}
                    <option value={-1}>Auto</option>
                </select>
            )
        : <select className="playercontroller-qualityselect" title="画質選択" id="pmw-qualityselector" />
}
