import { effectsState } from "@/components/PMWatch/modules/Player";
import { useRef, useEffect, RefObject } from "react";

function returnQValue(
    center: number,
    next: number | null,
    prev: number | null,
) {
    const f0 = center; // 中心周波数

    // 帯域幅を隣接する周波数を使って計算
    let f1 = 0,
        f2 = 0,
        bw;
    if (prev === null && next === null) return 0;

    if (prev === null && next !== null) {
        // 最初の周波数は次の周波数との差を使う
        f1 = f0;
        f2 = (f0 + next) / 2;
    } else if (prev !== null && next === null) {
        // 最後の周波数は前の周波数との差を使う
        f1 = (f0 + prev) / 2;
        f2 = f0;
    } else if (prev !== null && next !== null) {
        // その他は前後の中間点を使う
        f1 = (f0 + prev) / 2;
        f2 = (f0 + next) / 2;
    }
    // 帯域幅を計算
    bw = f2 - f1;

    return f0 / bw;
}

// https://memo88.hatenablog.com/entry/web-audio-api-gainnode-decibel を参考にさせていただきました
export function decibelToScale(value: number) {
    return Math.pow(10, value / 20);
}

export function scaleToDecibel(value: number) {
    return 20 * Math.log10(value);
}

// Thank you ChatGPT
export const useAudioEffects = (
    videoRef: RefObject<unknown>,
    loudnessControl: number,
    vefxSettings: any,
) => {
    const [frequencies] = useState([
        31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000,
    ]);
    const defaultEffectsState: effectsState = {
        equalizer: {
            enabled: false,
            gains: new Array(frequencies.length).fill(0),
        },
        highpass: {
            enabled: false,
            cutoffFrequency: 0,
            qFactor: 0.5,
            detune: 0,
        },
        lowpass: {
            enabled: false,
            cutoffFrequency: 16000,
            qFactor: 0.5,
            detune: 0,
        },
        echo: { enabled: false, delayTime: 0.25, feedback: 0.5, gain: 0 },
        preamp: { enabled: false, gain: 1 },
        mono: { enabled: false },
    };
    const [effectsState, setEffectsState] = useState<effectsState>({
        ...defaultEffectsState,
        ...vefxSettings,
    });

    const handleEffectsChange = (newState: effectsState) => {
        setEffectsState(newState);

        // 各エフェクトの更新処理
        updateEqualizer(newState.equalizer.gains);
        updateEcho(
            newState.echo.delayTime,
            newState.echo.feedback,
            newState.echo.gain,
        );
        updateHighpass(
            newState.highpass.cutoffFrequency,
            newState.highpass.qFactor,
            newState.highpass.detune,
        );
        updateLowpass(
            newState.lowpass.cutoffFrequency,
            newState.lowpass.qFactor,
            newState.highpass.detune,
        );
        updatePreampGain(decibelToScale(effectsState.preamp.gain));
    };

    const audioContextRef = useRef<AudioContext>(null!);

    const mediaElementSourceRef = useRef<MediaElementAudioSourceNode | null>(
        null,
    );

    const biquadFiltersRef = useRef<BiquadFilterNode[]>([]);

    const highpassBiquadFilterRef = useRef<BiquadFilterNode>(null!);
    const lowpassBiquadFilterRef = useRef<BiquadFilterNode>(null!);

    const echoPreGainNodeRef = useRef<GainNode | null>(null);
    const echoDelayNodeRef = useRef<DelayNode | null>(null);
    const echoFeedbackNodeRef = useRef<GainNode | null>(null);
    const echoGainNodeRef = useRef<GainNode | null>(null);

    const gainNodeRef = useRef<GainNode | null>(null);

    const loudnessGainNodeRef = useRef<GainNode | null>(null);

    const mergerSplitterNodeRef = useRef<ChannelSplitterNode | null>(null);
    const mergerGainLeftNodeRef = useRef<GainNode | null>(null);
    const mergerGainRightNodeRef = useRef<GainNode | null>(null);
    const mergerNodeRef = useRef<ChannelMergerNode | null>(null);

    const effectEnableState = Object.keys(effectsState).map(
        (key) => effectsState[key as keyof typeof effectsState].enabled,
    );

    function refreshConnection() {
        if (mediaElementSourceRef.current) {
            let lastNode: any = mediaElementSourceRef.current;
            // 一旦繋がるノードを切断してから接続するようにした
            // 全disconnect
            lastNode.disconnect();
            audioContextRef.current.destination.disconnect();

            // effect
            if (highpassBiquadFilterRef.current)
                highpassBiquadFilterRef.current.disconnect();
            if (lowpassBiquadFilterRef.current)
                lowpassBiquadFilterRef.current.disconnect();
            if (loudnessGainNodeRef.current)
                loudnessGainNodeRef.current.disconnect();
            if (gainNodeRef.current) gainNodeRef.current.disconnect();
            if (mergerNodeRef.current) mergerNodeRef.current.disconnect();
            if (echoGainNodeRef.current) echoGainNodeRef.current.disconnect();

            // eq
            biquadFiltersRef.current.forEach((filter) => {
                filter.disconnect();
            });

            // ノードを順次接続
            if (loudnessGainNodeRef.current)
                loudnessGainNodeRef.current.gain.value = loudnessControl;
            lastNode.connect(loudnessGainNodeRef.current);
            lastNode = loudnessGainNodeRef.current;

            biquadFiltersRef.current.forEach((filter) => {
                if (effectsState.equalizer.enabled) {
                    lastNode.connect(filter);
                    lastNode = filter;
                }
            });

            if (
                highpassBiquadFilterRef.current &&
                effectsState.highpass.enabled
            ) {
                lastNode.connect(highpassBiquadFilterRef.current);
                lastNode = highpassBiquadFilterRef.current;
            }

            if (
                lowpassBiquadFilterRef.current &&
                effectsState.lowpass.enabled
            ) {
                lastNode.connect(lowpassBiquadFilterRef.current);
                lastNode = lowpassBiquadFilterRef.current;
            }

            if (echoPreGainNodeRef.current && effectsState.echo.enabled) {
                lastNode.connect(echoPreGainNodeRef.current);
                lastNode = echoGainNodeRef.current;
            }

            if (gainNodeRef.current && effectsState.preamp.enabled) {
                lastNode.connect(gainNodeRef.current);
                lastNode = gainNodeRef.current;
            }

            if (mergerNodeRef.current && effectsState.mono.enabled) {
                lastNode.connect(mergerSplitterNodeRef.current);
                lastNode = mergerNodeRef.current;
            }

            lastNode.connect(audioContextRef.current.destination);
        }
    }

    useEffect(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new window.AudioContext();
        }

        if (
            videoRef.current instanceof HTMLVideoElement &&
            !mediaElementSourceRef.current
        ) {
            mediaElementSourceRef.current =
                audioContextRef.current.createMediaElementSource(
                    videoRef.current,
                );

            // イコライザーの設定
            biquadFiltersRef.current = frequencies.map((freq, index) => {
                const filter = audioContextRef.current.createBiquadFilter();

                filter.type = "peaking";
                filter.frequency.value = freq;
                const next =
                    index + 1 > frequencies.length - 1
                        ? null
                        : frequencies[index + 1];
                const prev = index - 1 < 0 ? null : frequencies[index - 1];
                filter.Q.value = returnQValue(freq, next, prev);
                filter.gain.value = effectsState.equalizer.enabled
                    ? effectsState.equalizer.gains[frequencies.indexOf(freq)]
                    : 0;
                return filter;
            });

            // ハイパスフィルター
            highpassBiquadFilterRef.current =
                audioContextRef.current.createBiquadFilter();
            if (highpassBiquadFilterRef.current) {
                highpassBiquadFilterRef.current.type = "highpass";
                highpassBiquadFilterRef.current.frequency.value =
                    effectsState.highpass.cutoffFrequency ?? 0;
                highpassBiquadFilterRef.current.Q.value =
                    effectsState.highpass.qFactor ?? 0.5;
                highpassBiquadFilterRef.current.detune.value =
                    effectsState.highpass.detune ?? 0;
            }

            // ローパスフィルター
            lowpassBiquadFilterRef.current =
                audioContextRef.current.createBiquadFilter();
            if (lowpassBiquadFilterRef.current) {
                lowpassBiquadFilterRef.current.type = "lowpass";
                lowpassBiquadFilterRef.current.frequency.value =
                    effectsState.lowpass.cutoffFrequency ?? 16000;
                lowpassBiquadFilterRef.current.Q.value =
                    effectsState.lowpass.qFactor ?? 0.5;
                lowpassBiquadFilterRef.current.detune.value =
                    effectsState.lowpass.detune ?? 0;
            }

            // エコーの設定
            echoPreGainNodeRef.current = audioContextRef.current.createGain();
            echoPreGainNodeRef.current.gain.value = 1;

            echoDelayNodeRef.current = audioContextRef.current.createDelay();
            if (echoDelayNodeRef.current)
                echoDelayNodeRef.current.delayTime.value =
                    effectsState.echo.delayTime || 0.1;

            echoFeedbackNodeRef.current = audioContextRef.current.createGain();
            if (echoFeedbackNodeRef.current)
                echoFeedbackNodeRef.current.gain.value =
                    effectsState.echo.feedback || 0.25;

            echoGainNodeRef.current = audioContextRef.current.createGain();
            if (echoGainNodeRef.current)
                echoGainNodeRef.current.gain.value =
                    effectsState.echo.gain || 0.5;

            if (
                echoPreGainNodeRef.current &&
                echoDelayNodeRef.current &&
                echoFeedbackNodeRef.current &&
                echoGainNodeRef.current
            ) {
                echoPreGainNodeRef.current.connect(echoDelayNodeRef.current);
                echoDelayNodeRef.current.connect(echoFeedbackNodeRef.current);
                echoFeedbackNodeRef.current.connect(echoDelayNodeRef.current);
                echoDelayNodeRef.current.connect(echoGainNodeRef.current);
            }

            // プリアンプの設定
            gainNodeRef.current = audioContextRef.current.createGain();
            if (gainNodeRef.current)
                gainNodeRef.current.gain.value = decibelToScale(
                    effectsState.preamp.gain,
                );

            // ラウドネスコントロール
            loudnessGainNodeRef.current = audioContextRef.current.createGain();
            if (loudnessGainNodeRef.current)
                loudnessGainNodeRef.current.gain.value = loudnessControl;

            // モノラル化の設定
            mergerSplitterNodeRef.current =
                audioContextRef.current.createChannelSplitter(2);
            mergerGainLeftNodeRef.current =
                audioContextRef.current.createGain();
            mergerGainRightNodeRef.current =
                audioContextRef.current.createGain();
            mergerGainLeftNodeRef.current.gain.value = 0.5;
            mergerGainRightNodeRef.current.gain.value = 0.5;
            mergerNodeRef.current =
                audioContextRef.current.createChannelMerger(1);

            mergerSplitterNodeRef.current.connect(
                mergerGainLeftNodeRef.current,
                0,
            );
            mergerSplitterNodeRef.current.connect(
                mergerGainRightNodeRef.current,
                1,
            );
            mergerGainLeftNodeRef.current.connect(mergerNodeRef.current, 0, 0);
            mergerGainRightNodeRef.current.connect(mergerNodeRef.current, 0, 0);
        }
        refreshConnection();
    }, [frequencies, ...effectEnableState, loudnessControl]);

    // イコライザーのゲイン更新
    const updateEqualizer = (gains: number[]) => {
        biquadFiltersRef.current.forEach((filter, i) => {
            filter.gain.value = gains[i];
        });
    };

    // エコーの設定更新
    const updateEcho = (time: number, feedback: number, gain: number) => {
        if (
            echoDelayNodeRef.current &&
            echoFeedbackNodeRef.current &&
            echoGainNodeRef.current
        ) {
            /*if (!effectsState.echo.enabled) {
                echoDelayNodeRef.current.delayTime.value = 0;
                echoFeedbackNodeRef.current.gain.value = 0;
                echoGainNodeRef.current.gain.value = 0;
                return
            }*/
            echoDelayNodeRef.current.delayTime.value = time;
            echoFeedbackNodeRef.current.gain.value = feedback;
            echoGainNodeRef.current.gain.value = gain;
        }
    };

    const updateHighpass = (
        cutoffFrequency: number,
        qFactor: number,
        detune: number,
    ) => {
        if (highpassBiquadFilterRef.current) {
            highpassBiquadFilterRef.current.frequency.value =
                cutoffFrequency ?? 0;
            highpassBiquadFilterRef.current.Q.value = qFactor ?? 0.5;
            highpassBiquadFilterRef.current.detune.value = detune ?? 0;
        }
    };

    const updateLowpass = (
        cutoffFrequency: number,
        qFactor: number,
        detune: number,
    ) => {
        if (lowpassBiquadFilterRef.current) {
            lowpassBiquadFilterRef.current.frequency.value =
                cutoffFrequency ?? 16000;
            lowpassBiquadFilterRef.current.Q.value = qFactor ?? 0.5;
            lowpassBiquadFilterRef.current.detune.value = detune ?? 0;
        }
    };

    // プリアンプのゲイン更新
    const updatePreampGain = (gain: number) => {
        if (gainNodeRef.current) {
            /*if (!effectsState.preamp.enabled) {
                gainNodeRef.current.gain.value = 0;
                return
            }*/
            gainNodeRef.current.gain.value = gain;
        }
    };

    const updateLoudnessControl = (gain: number) => {
        if (loudnessGainNodeRef.current)
            loudnessGainNodeRef.current.gain.value = gain;
    };

    return {
        updateEqualizer,
        updateEcho,
        updatePreampGain,
        updateLoudnessControl,
        effectsState,
        setEffectsState,
        frequencies,
        handleEffectsChange,
    };
};
