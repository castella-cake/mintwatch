// import { useEffect, useMemo, useState, useRef } from "react";
// import { useStorageContext } from "../extensionHook";
// import { useLang } from "../localizeHook";

import { RefObject } from "react"
import { effectsState } from "@/hooks/eqHooks"

function delayString(delayTime: number, feedback: number) {
    if (feedback <= 0) {
        return "Delay"
    }
    else if (delayTime <= 0.15) {
        return "Echo"
    }
    else {
        return "Reverb"
    }
}

function VefxDisplay({ effectsState }: { effectsState: effectsState }) {
    if (!effectsState) return <></>
    const enabledEffects = Object.keys(effectsState)
        .map((elem) => {
            if (
                elem
                && effectsState[elem as keyof effectsState].enabled
                && elem === "echo"
            )
                return delayString(
                    effectsState.echo.delayTime,
                    effectsState.echo.feedback,
                )
            if (elem && effectsState[elem as keyof effectsState].enabled)
                return elem
            return false
        })
        .filter(elem => typeof elem === "string")
    let bgColor = ""
    let textColor = ""
    let text = ""
    let isGlowing = true
    if (enabledEffects.length >= 3) {
        text = "MULTIPLE EFFECTS"
        bgColor = "#ffe53d"
        textColor = "#2b2600"
    }
    else if (enabledEffects.length == 2) {
        text = enabledEffects
            .map((elem: string) => elem.toUpperCase())
            .join("/")
        bgColor = "#4d88ff"
        textColor = "#000729"
    }
    else if (enabledEffects.length == 1) {
        if (enabledEffects[0]) text = enabledEffects[0].toUpperCase()
        bgColor = "#3de8ff"
        textColor = "#002226"
    }
    else {
        text = "EFFECT OFF"
        bgColor = "#333"
        textColor = "#fff"
        isGlowing = false
    }
    return (
        <div
            className="vefx-effectdisplay"
            style={{ ["--bg" as any]: bgColor, ["--color" as any]: textColor }}
            data-is-glowing={isGlowing ? "true" : "false"}
        >
            {text}
        </div>
    )
}

function VefxController({
    frequencies,
    effectsState,
    onEffectsChange,
    nodeRef,
}: {
    frequencies: number[]
    effectsState: effectsState
    onEffectsChange: any
    nodeRef: RefObject<HTMLDivElement | null>
}) {
    // const lang = useLang()
    // const { syncStorage, setSyncStorageValue } = useStorageContext()
    const handleGainChange = (index: number, value: number) => {
        const newGains = [...effectsState.equalizer.gains]
        newGains[index] = value
        onEffectsChange({
            ...effectsState,
            equalizer: { ...effectsState.equalizer, gains: newGains },
        })
    }

    const handleEchoDelayChange = (value: number) => {
        onEffectsChange({
            ...effectsState,
            echo: { ...effectsState.echo, delayTime: value },
        })
    }

    const handleEchoFeedbackChange = (value: number) => {
        onEffectsChange({
            ...effectsState,
            echo: { ...effectsState.echo, feedback: value },
        })
    }
    const handleEchoGainChange = (value: number) => {
        onEffectsChange({
            ...effectsState,
            echo: { ...effectsState.echo, gain: value },
        })
    }

    const handlePreampGainChange = (value: number) => {
        onEffectsChange({
            ...effectsState,
            preamp: { ...effectsState.preamp, gain: value },
        })
    }

    const handleHighpassCutoffFrequencyChange = (value: number) => {
        onEffectsChange({
            ...effectsState,
            highpass: { ...effectsState.highpass, cutoffFrequency: value },
        })
    }
    const handleHighpassQFactorChange = (value: number) => {
        onEffectsChange({
            ...effectsState,
            highpass: { ...effectsState.highpass, qFactor: value },
        })
    }
    const handleHighpassDetuneChange = (value: number) => {
        onEffectsChange({
            ...effectsState,
            highpass: { ...effectsState.highpass, detune: value },
        })
    }

    const handleLowpassCutoffFrequencyChange = (value: number) => {
        onEffectsChange({
            ...effectsState,
            lowpass: { ...effectsState.lowpass, cutoffFrequency: value },
        })
    }
    const handleLowpassQFactorChange = (value: number) => {
        onEffectsChange({
            ...effectsState,
            lowpass: { ...effectsState.lowpass, qFactor: value },
        })
    }
    const handleLowpassDetuneChange = (value: number) => {
        onEffectsChange({
            ...effectsState,
            lowpass: { ...effectsState.lowpass, detune: value },
        })
    }

    const handleEnabledEffect = (effectName: string) => {
        onEffectsChange({
            ...effectsState,
            [effectName]: {
                ...effectsState[effectName as keyof effectsState],
                enabled:
                    !effectsState[effectName as keyof effectsState].enabled,
            },
        })
    }

    return (
        <div className="vefx-container" id="pmw-vefx" ref={nodeRef}>
            <div className="vefx-container-inner">
                <div className="vefx-title">EFFECT CONTROL</div>
                <VefxDisplay effectsState={effectsState} />
                <div className="vefx-module">
                    <label>
                        <input
                            type="checkbox"
                            checked={effectsState.mono.enabled}
                            onChange={() => handleEnabledEffect("mono")}
                        />
                        MONO
                    </label>
                </div>
                <div className="vefx-module">
                    <label>
                        <input
                            type="checkbox"
                            checked={effectsState.equalizer.enabled}
                            onChange={() => handleEnabledEffect("equalizer")}
                        />
                        EQUALIZER
                    </label>
                    {frequencies.map((freq, i) => (
                        <div key={freq} className="vefx-slidercontainer">
                            <label className="global-flex">
                                <span className="global-flex1">
                                    {freq.toString().replace("000", "K")}
                                </span>
                                {effectsState.equalizer.gains[i] > 0 && "+"}
                                {effectsState.equalizer.gains[i]}
                                dB
                            </label>
                            <input
                                type="range"
                                min="-10"
                                max="10"
                                step="1"
                                value={effectsState.equalizer.gains[i]}
                                onChange={e =>
                                    handleGainChange(
                                        i,
                                        parseFloat(e.target.value),
                                    )}
                                list="eq-list"
                                disabled={!effectsState.equalizer.enabled}
                            />
                        </div>
                    ))}
                    <datalist id="eq-list">
                        {[-15, -10, -5, 0, 5, 10, 15].map((elem) => {
                            return (
                                <option key={`eq-list-${elem}`}>{elem}</option>
                            )
                        })}
                    </datalist>
                </div>

                <div className="vefx-module">
                    <label>
                        <input
                            type="checkbox"
                            checked={effectsState.preamp.enabled}
                            onChange={() => handleEnabledEffect("preamp")}
                        />
                        <span className="vefx-name">PREAMP</span>
                        <span className="vefx-value">
                            {effectsState.preamp.gain > 0 && "+"}
                            {effectsState.preamp.gain}
                            dB
                        </span>
                    </label>
                    <div className="vefx-slidercontainer">
                        <input
                            type="range"
                            min="-15"
                            max="15"
                            step="0.1"
                            value={effectsState.preamp.gain}
                            list="eq-list"
                            onChange={e =>
                                handlePreampGainChange(
                                    parseFloat(e.target.value),
                                )}
                            disabled={!effectsState.preamp.enabled}
                        />
                    </div>
                </div>

                <div className="vefx-module">
                    <label>
                        <input
                            type="checkbox"
                            checked={effectsState.highpass.enabled}
                            onChange={() => handleEnabledEffect("highpass")}
                        />
                        <span className="vefx-name">HIGHPASS</span>
                    </label>
                    <span className="vefx-echo-value">
                        C
                        {effectsState.highpass.cutoffFrequency}
                        Hz / Q
                        {" "}
                        {effectsState.highpass.qFactor}
                        {" "}
                        D
                        {effectsState.highpass.detune}
                        {" "}
                        Hz
                    </span>
                    <div className="vefx-slidercontainer">
                        <label>Cutoff</label>
                        <input
                            type="range"
                            min="0"
                            max="16000"
                            step="1"
                            value={effectsState.highpass.cutoffFrequency}
                            onChange={e =>
                                handleHighpassCutoffFrequencyChange(
                                    parseFloat(e.target.value),
                                )}
                            disabled={!effectsState.highpass.enabled}
                        />
                    </div>
                    <div className="vefx-slidercontainer">
                        <label>Q Factor</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={effectsState.highpass.qFactor}
                            onChange={e =>
                                handleHighpassQFactorChange(
                                    parseFloat(e.target.value),
                                )}
                            disabled={!effectsState.highpass.enabled}
                        />
                    </div>
                    <div className="vefx-slidercontainer">
                        <label>Detune</label>
                        <input
                            type="range"
                            min="-1200"
                            max="1200"
                            step="1"
                            list="filter-detune-list"
                            value={effectsState.highpass.detune}
                            onChange={e =>
                                handleHighpassDetuneChange(
                                    parseFloat(e.target.value),
                                )}
                            disabled={!effectsState.highpass.enabled}
                        />
                    </div>
                </div>

                <div className="vefx-module">
                    <label>
                        <input
                            type="checkbox"
                            checked={effectsState.lowpass.enabled}
                            onChange={() => handleEnabledEffect("lowpass")}
                        />
                        <span className="vefx-name">LOWPASS</span>
                    </label>
                    <span className="vefx-echo-value">
                        C
                        {effectsState.lowpass.cutoffFrequency}
                        Hz / Q
                        {" "}
                        {effectsState.lowpass.qFactor}
                        {" "}
                        D
                        {effectsState.lowpass.detune}
                        {" "}
                        Hz
                    </span>
                    <div className="vefx-slidercontainer">
                        <label>Cutoff</label>
                        <input
                            type="range"
                            min="0"
                            max="16000"
                            step="1"
                            value={effectsState.lowpass.cutoffFrequency}
                            onChange={e =>
                                handleLowpassCutoffFrequencyChange(
                                    parseFloat(e.target.value),
                                )}
                            disabled={!effectsState.lowpass.enabled}
                        />
                    </div>
                    <div className="vefx-slidercontainer">
                        <label>Q Factor</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={effectsState.lowpass.qFactor}
                            onChange={e =>
                                handleLowpassQFactorChange(
                                    parseFloat(e.target.value),
                                )}
                            disabled={!effectsState.lowpass.enabled}
                        />
                    </div>
                    <div className="vefx-slidercontainer">
                        <label>Detune</label>
                        <input
                            type="range"
                            min="-1200"
                            max="1200"
                            step="1"
                            list="filter-detune-list"
                            value={effectsState.lowpass.detune}
                            onChange={e =>
                                handleLowpassDetuneChange(
                                    parseFloat(e.target.value),
                                )}
                            disabled={!effectsState.lowpass.enabled}
                        />
                    </div>
                </div>
                <datalist id="filter-detune-list">
                    {[0].map((elem) => {
                        return (
                            <option key={`gain-list-${elem}`}>{elem}</option>
                        )
                    })}
                </datalist>

                <div className="vefx-module">
                    <label>
                        <input
                            type="checkbox"
                            checked={effectsState.echo.enabled}
                            onChange={() => handleEnabledEffect("echo")}
                        />
                        <span className="vefx-name">
                            {delayString(
                                effectsState.echo.delayTime,
                                effectsState.echo.feedback,
                            ).toUpperCase()}
                        </span>
                    </label>
                    <div className="vefx-echo-value">
                        d
                        {effectsState.echo.delayTime}
                        s / f
                        {effectsState.echo.feedback}
                        x / g
                        {effectsState.echo.gain}
                        x
                    </div>
                    <div className="vefx-slidercontainer">
                        <label>Delay Time</label>
                        <input
                            type="range"
                            min="0"
                            max="0.5"
                            step="0.05"
                            value={effectsState.echo.delayTime}
                            list="gain-list"
                            onChange={e =>
                                handleEchoDelayChange(
                                    parseFloat(e.target.value),
                                )}
                            disabled={!effectsState.echo.enabled}
                        />
                    </div>
                    <div className="vefx-slidercontainer">
                        <label>Feedback</label>
                        <input
                            type="range"
                            min="0"
                            max="0.5"
                            step="0.05"
                            value={effectsState.echo.feedback}
                            list="gain-list"
                            onChange={e =>
                                handleEchoFeedbackChange(
                                    parseFloat(e.target.value),
                                )}
                            disabled={!effectsState.echo.enabled}
                        />
                    </div>
                    <div className="vefx-slidercontainer">
                        <label>Gain</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={effectsState.echo.gain}
                            list="gain-list"
                            onChange={e =>
                                handleEchoGainChange(parseFloat(e.target.value))}
                            disabled={!effectsState.echo.enabled}
                        />
                    </div>
                    <datalist id="gain-list">
                        {[-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1].map(
                            (elem) => {
                                return (
                                    <option key={`gain-list-${elem}`}>
                                        {elem}
                                    </option>
                                )
                            },
                        )}
                    </datalist>
                </div>
            </div>
        </div>
    )
}

export default VefxController
