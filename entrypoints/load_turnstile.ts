// MV3 doesn't accept remote code
import "url:https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

interface NewWindow extends Window{
    turnstile?: Turnstile.Turnstile
}
declare let window: NewWindow;

export default defineUnlistedScript({
    main: () => {
        const TARGET_ORIGIN = "https://www.nicovideo.jp"
        window.addEventListener("message", (event) => {
            if (typeof event.data === "object" && event.data.source === "mintWatchRender") {
                if (event.data.type === "requestChallengeToken" && event.data.data.siteKey) {
                    const renderId = turnstile.render("#pmw-turnstile-widget", {
                        sitekey: event.data.data.siteKey,
                        callback: function (token) {
                            console.log(`Page Script Challenge Success ${token}`);
                            window.postMessage({ source: "mintWatchTurnstileHandler", type: "challengeTokenResponse", data: { status: true, token } }, TARGET_ORIGIN)
                            if (typeof renderId === "string") {
                                setTimeout(() => turnstile.remove(renderId), 1000)
                            }
                        },
                        "error-callback": (reason) => {
                            console.log(`Page Script Challenge Failed ${reason}`);
                            window.postMessage({ source: "mintWatchTurnstileHandler", type: "challengeTokenResponse", data: { status: false, reason } }, TARGET_ORIGIN)
                            if (typeof renderId === "string") {
                                setTimeout(() => turnstile.remove(renderId), 1000)
                            }
                        }
                    });
                } else if (event.data.type === "checkHandler") {
                    window.postMessage({ source: "mintWatchTurnstileHandler", type: "helloFromHandler" }, TARGET_ORIGIN)
                }
            }
        })
        //console.log(window.turnstile);
    }
})