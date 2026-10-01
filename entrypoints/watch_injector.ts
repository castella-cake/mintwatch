// @unimport-disable
// scriptタグ経由で注入される""ページスクリプト""。拡張機能APIは使えないことに注意。
import Hls from "hls.js"
import { VideoDataRootObject, Video, Audio } from "@/types/watch/Base"
import {
    buildVideoLevelMap,
    buildVideoLevelOptions,
    pickHighestLevel,
    type VideoLevelMap,
} from "@/utils/hlsLevelSelector"

export default defineUnlistedScript({
    main() {
        // window.__NV_PUBLIC_PATH__ = "https://256.256.256.256";
        // ActionTrackIdで各レンダーを識別する
        let previousATI = ""
        // 動画変更の検出
        let previousVideoId = ""
        // 現在の VideoLevelMap (select change で逆引きするため)
        let currentMap: VideoLevelMap | null = null
        document.addEventListener("pmw_playerReady", (e: any) => {
            // CORS関係でオブジェクトはStringになって渡されます。
            const detail = JSON.parse(e.detail)
            /* Readonlyです {
            videoInfo: watch/<ID>?responseType=json で返ってくる動画情報のオブジェクト,
            actionTrackId: 現在のレンダーで使っているアクショントラックID,
            commentContent: /v1/threadsで返ってくるコメント情報のオブジェクト,
        } */
            // console.log(detail)
            // 以前のATIと一緒ならスキップする
            if (detail.actionTrackId !== previousATI) {
                // console.log("Player injecting...")
                /*
            ここに好きに処理を書く。引数でオブジェクトを渡して分離した関数で処理させることをおすすめします
            これでもなお二重実行されることがあるので、必ず要素をappendChildしたりする前に、
            その要素がすでにドキュメント上に存在していないか確認してください
            */
                injectMediaToPlayer(detail)
                // 最後のATIを記録しておく
                previousATI = detail.actionTrackId
            }
        })

        async function injectMediaToPlayer({
            videoInfo,
        }: {
            videoInfo: VideoDataRootObject
            actionTrackId: string
        }) {
            //
            if (!document.getElementById("pmwp-cyaki-mediainjector")) {
                console.log("PMW Plugin: 外部HLS プラグイン")
                const pluginList = document.getElementById("pmw-plugin-list")

                const mediaInjectorContainer = document.createElement("div")
                mediaInjectorContainer.id = "pmwp-cyaki-mediainjector"
                mediaInjectorContainer.className = "plugin-list-item"
                mediaInjectorContainer.innerHTML = `
                    <div class="plugin-list-item-title">
                        外部HLS プラグイン (ビルトイン)
                    </div>
                    <div class="plugin-list-item-desc">
                        ページスクリプトとしてHLSを実行し、一部のCORS問題を回避します。
                    </div>
                `
                if (pluginList) pluginList.appendChild(mediaInjectorContainer)
            }

            const levelSelector: HTMLElement | null = document.getElementById("pmw-qualityselector")
            const seekbarBuffered: Element | null = document.getElementsByClassName("seekbar-buffered")[0]

            const watchV4Data = videoInfo?.data?.response?.$watchV4?.data
            const media = watchV4Data?.media
            const video = watchV4Data?.video

            if (
                media
                && media.hls
                && media.hls.url
                && media.accessRightKey
                && media.contents?.videos
                && media.contents?.audios
                && media.hls.outputs
                && video
                && video.id !== previousVideoId
            ) {
                // hlsの取得より先に動画が変更される可能性を考えて、とりあえず最初に前の動画IDを保存
                previousVideoId = video.id

                const hlsUrl = media.hls.url
                const videos: Video[] = media.contents.videos
                const audios: Audio[] = media.contents.audios
                const outputs = media.hls.outputs

                const videoElement: any
                    = document.getElementById("pmw-element-video") // <HTMLVideoElement>で回避できるけど、babelがjsxに関するエラーを吐くのでanyにしておく。
                const hls = new Hls({
                    debug: false,
                    xhrSetup: function (xhr) {
                        // xhrでクッキーを含める
                        xhr.withCredentials = true
                    },
                    fetchSetup: function (context, initParams) {
                        // クロスオリジンであってもクッキーを含める
                        initParams.credentials = "include"
                        return new Request(context.url, initParams)
                    },
                })
                // videoのrefにアタッチ
                if (videoElement) hls.attachMedia(videoElement)
                // 読み込み
                hls.loadSource(hlsUrl)
                hls.on(Hls.Events.ERROR, (err) => {
                    console.log(err)
                })

                // manifest パース時に outputs[].assetUnitNames を権威として
                // (videoId, audioId) → level index の map を作り、最高レベルを startLevel / currentLevel に反映する。
                hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                    const map = buildVideoLevelMap(data.levels, outputs, videos, audios)
                    currentMap = map

                    const target = pickHighestLevel(map, videos, audios)
                    if (target !== undefined) {
                        hls.startLevel = target
                        hls.currentLevel = target
                    }
                })

                // LEVELS_UPDATED でも map を再構築し、最高レベルを再適用する
                hls.on(Hls.Events.LEVELS_UPDATED, (event, data) => {
                    const map = buildVideoLevelMap(data.levels, outputs, videos, audios)
                    currentMap = map

                    const target = pickHighestLevel(map, videos, audios)
                    if (target !== undefined) {
                        hls.currentLevel = target
                    }
                })

                hls.on(Hls.Events.LEVEL_SWITCHED, (e, data) => {
                    // console.log("switched:", data)
                    if (!levelSelector || !(levelSelector instanceof HTMLSelectElement)) return
                    // data.level === -1 は hls.js の Auto 相当
                    if (data.level === -1) {
                        const autoIdx = Array.from(levelSelector.options).findIndex(o => o.value === "-1")
                        if (autoIdx >= 0) levelSelector.selectedIndex = autoIdx
                    } else {
                        levelSelector.selectedIndex = data.level
                    }
                })

                // manifest 確定後に select を API 提供の video ラベルで populate する
                // (byVideo map を使い、各 video につき最高音質の hls level を 1件だけ表示)
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    if (!levelSelector || !(levelSelector instanceof HTMLSelectElement)) return
                    levelSelector.innerHTML = ""
                    const map = currentMap
                    if (!map) return
                    const options = buildVideoLevelOptions(videos, map)
                    for (const opt of options) {
                        const option = document.createElement("option")
                        option.value = String(opt.level)
                        option.textContent = opt.label
                        levelSelector.appendChild(option)
                    }

                    const autoOpt = document.createElement("option")
                    autoOpt.value = "-1"
                    autoOpt.textContent = "Auto"
                    levelSelector.appendChild(autoOpt)
                })

                hls.on(Hls.Events.BUFFER_APPENDED, () => {
                    if (videoElement.buffered.length && seekbarBuffered instanceof HTMLElement) {
                        const bufferedDuration = videoElement.buffered.end(videoElement.buffered.length - 1)
                        const duration = videoElement.duration
                        seekbarBuffered.style.width = `${Math.min(bufferedDuration / duration * 100, 100)}%`
                    }
                    // setBufferedDuration()
                })
                hls.on(Hls.Events.BUFFER_FLUSHED, () => {
                    if (videoElement.buffered.length && seekbarBuffered instanceof HTMLElement) {
                        seekbarBuffered.style.width = `0%`
                    }
                })

                if (levelSelector) levelSelector.addEventListener("change", (e) => {
                    if (e.target && e.target instanceof HTMLSelectElement) {
                        const level = Number(e.target.value)
                        // console.log("change: ", e)
                        hls.currentLevel = level
                    }
                })
            }
        }
        const script = document.currentScript
        script?.dispatchEvent(
            new CustomEvent("mwPageHlsReady", {}),
        )
    },
})
