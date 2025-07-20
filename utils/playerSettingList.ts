import { threadLabelLang } from "./threadLabel"

export type PlayerSetting = {
    type: "select" | "checkbox" | "percentageSliders" | "details"
    options?: any[]
    defaultValue: any
    texts?: string[]
    name: string
    hint?: string
    children?: PlayerSetting[]
    sliders?: {
        [key: string]: {
            min: number
            max: number
            step: number
            name: string
        }
    }
    detailsTarget?: string
}

export type PlayerSettingList = { [key: string]: PlayerSettingCategory }

export type PlayerSettingCategory = {
    label: string
    visible?: boolean
    children: { [key: string]: PlayerSetting }
}

export const playerSettingsLabel = {
    basic: "基本",
    comments: "コメント",
}

export const playerSettings: PlayerSettingList = {
    basic: {
        label: "基本",
        children: {
            playerAreaSize: {
                type: "select",
                options: [0, 1, 2],
                defaultValue: 1,
                texts: ["小", "中", "フル"],
                name: "ページサイズ",
                hint: "3カラムでは常にフル表示になります。",
            },
            commentOpacity: {
                type: "select",
                options: [0.25, 0.5, 0.75, 1],
                defaultValue: 1,
                texts: ["非常に薄い(25%)", "薄い(50%)", "やや薄い(75%)", "透過なし"],
                name: "コメント不透明度",
            },
            playbackRate: {
                type: "select",
                options: [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
                texts: ["x0.1", "x0.25", "x0.5", "x0.75", "x1", "x1.25", "x1.5", "x1.75", "x2"],
                name: "再生速度",
                defaultValue: 1.0,
            },
            integratedControl: {
                type: "select",
                defaultValue: "never",
                options: ["never", "fullscreen", "always"],
                texts: ["分割表示", "全画面時のみ統合表示", "常に統合表示"],
                name: "コントローラーの表示",
            },
            sharedNgLevel: {
                type: "select",
                defaultValue: "mid",
                options: ["none", "low", "mid", "high"],
                name: "共有NGコメントレベル",
                texts: ["なし", "低 (< -10000)", "中 (< -4800)", "高 (< -1000)"],
            },
            resumePlayback: {
                type: "select",
                defaultValue: "smart",
                options: ["never", "smart", "always"],
                texts: ["しない", "スマート", "常に"],
                name: "レジューム再生",
                hint: "プレミアム会員資格が必要です。",
            },
            rewindTime: {
                type: "select",
                defaultValue: "10",
                options: ["5", "10", "15", "30"],
                texts: ["5秒", "10秒", "15秒", "30秒"],
                name: "スキップボタンのシーク時間",
            },
            enableWheelGesture: {
                type: "checkbox",
                defaultValue: true,
                name: "音量ジェスチャーを使用",
                hint: "動画の上で右クリックしながらホイールを回して音量を変更できます。",
            },
            enableContinuousPlay: {
                type: "checkbox",
                defaultValue: true,
                name: "再生キューで連続再生",
            },
            continuousPlayWithRecommend: {
                type: "checkbox",
                defaultValue: false,
                name: "連続再生におすすめを含める",
                hint: "再生キューに動画がない場合に、おすすめ動画を連続再生します。",
            },
            enableCommentPiP: {
                type: "checkbox",
                defaultValue: false,
                name: "PiPでコメントを表示(実験的)",
                hint: "コメント透過率と描画FPSが固定されます。",
            },
            enableLoudnessData: {
                type: "checkbox",
                defaultValue: true,
                name: "ラウドネスノーマライズ",
            },
            requestMonitorFullscreen: {
                type: "checkbox",
                defaultValue: true,
                name: "モニターサイズのフルスクリーンを使用",
            },
        },
    },
    comments: {
        label: "コメント",
        children: {
            customCommentOpacityDetails: {
                type: "details",
                name: "カスタムのコメント不透明度を設定",
                defaultValue: null,
                detailsTarget: "customCommentOpacity",
                hint: "タイプ別にコメントの不透明度を設定します。",
            },
            commentRenderFps: {
                type: "select",
                defaultValue: -1,
                options: [30, 60, 120, -1],
                name: "コメント描画FPS",
                texts: ["30FPS", "60FPS", "120FPS", "自動"],
            },
            enableFancyRendering: {
                type: "checkbox",
                name: "高解像度でコメントを描画",
                defaultValue: false,
                hint: "弾幕が流れている場合などにフレームレートが低下する可能性があります。",
            },
            enableInterpolateCommentRendering: {
                type: "checkbox",
                name: "コメントの補完描画",
                defaultValue: true,
                hint: "Firefox 環境で大幅にフレームレートが改善します。",
            },
            disableCommentOutline: {
                type: "checkbox",
                defaultValue: false,
                name: "コメントの縁取りを無効化",
            },
            pauseOnCommentInput: {
                type: "checkbox",
                defaultValue: false,
                name: "コメント入力時に一時停止してプレビュー",
            },
        },
    },
    customCommentOpacity: {
        label: "カスタムのコメント透明度",
        visible: false,
        children: {
            customCommentOpacity: {
                type: "percentageSliders",
                defaultValue: {},
                name: "カスタムのコメント透明度",
                sliders: Object.keys(threadLabelLang).reduce((acc, key) => ({
                    ...acc,
                    [key]: {
                        name: threadLabelLang[key],
                        min: 0,
                        max: 1,
                        step: 0.05,
                    },
                }), {}),
            },
        },
    },
}

export function toFlatPlayerSettings(playerSettingList: PlayerSettingList): { [key: string]: PlayerSetting } {
    return Object.keys(playerSettingList).reduce((prev, current) => ({ ...prev, ...playerSettingList[current].children }), {})
}
