
export async function openLink(href: string) {
    const res = await browser.runtime.sendMessage({ type: "openThisNCLink", href });
    if (res.status !== true) {
        // NGだったらwindow.openにフォールバック
        window.open(href);
        window.close();
    } else {
        // OKだったらclose
        window.close();
    }
}

export function linkAction(e: any) {
    // 現在のタブがニコニコ動画の場合はそのタブで開き、そうでない場合は新しいタブで開きます。
    // aのonClickに引数も含めてそのまま渡すことで動作します。
    //console.log(e)
    // イベントを中止してこっちで代行する
    const href = e.target.href ?? e.currentTarget.href
    openLink(href)
    e.preventDefault()
    
}