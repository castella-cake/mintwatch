import { expect, test } from "../fixtures"

test("Search: 現在のページから連続再生ボタンと動画カードのアイコンが表示される", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/search/TEST")
    await page.bringToFront()
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    // 現在のページから連続再生ボタン
    const continuousPlayButton = page.locator(".search-continuous-play-button")
    await expect(continuousPlayButton).toBeVisible()
    await expect(continuousPlayButton).toContainText("現在のページから連続再生")

    // 先頭動画へのリンクで、playlistクエリが付与されている
    const buttonHref = await continuousPlayButton.getAttribute("href")
    expect(buttonHref).toContain("/watch/sm0")
    expect(buttonHref).toContain("playlist=")

    // 動画カードのアイコンもplaylistクエリ付きで表示される
    const playFromVideoButton = page.locator(".videoitem-card .info-card-externalbutton").first()
    await expect(playFromVideoButton).toHaveAttribute("href", /\/watch\/sm0\?playlist=/)
})

test("Search: 現在のページから連続再生で視聴ページへ遷移し、検索結果が再生キューに反映される", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/search/TEST")
    await page.bringToFront()
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    await page.locator(".search-continuous-play-button").click()

    // playlistクエリ付きで視聴ページに遷移する
    await page.waitForURL(/\/watch\/sm0\?playlist=.*/, { timeout: 10000 })

    // 再生キューはタブパネルなので「再生リスト」タブを開く
    await page.locator(".stacker-tabbutton", { hasText: "再生リスト" }).click()
    await page.waitForSelector("#pmw-playlist .playlist-items-container .info-card", { timeout: 10000 })

    // 検索プレイリストがキューに反映され、現在の動画(sm0)が先頭に来る
    const queueCards = page.locator("#pmw-playlist .playlist-items-container .info-card")
    await expect(queueCards).toHaveCount(3)
    await expect(queueCards.first()).toHaveAttribute("data-nowplaying", "true")
    await expect(queueCards.first()).toContainText("For testing purposes only")
})

test("Search: 動画カードのアイコンからその動画を先頭にした連続再生へ遷移する", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/tag/テスト")
    await page.bringToFront()
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    const playFromVideoButton = page.locator(".videoitem-card .info-card-externalbutton").first()
    await expect(playFromVideoButton).toHaveAttribute("href", /\/watch\/sm0\?playlist=/)

    // アイコンはカードホバー時のみ操作できるため、ホバーしてからクリックする
    await page.locator(".videoitem-card").first().hover()
    await playFromVideoButton.click()

    await page.waitForURL(/\/watch\/sm0\?playlist=.*/, { timeout: 10000 })

    // 再生キューはタブパネルなので「再生リスト」タブを開く
    await page.locator(".stacker-tabbutton", { hasText: "再生リスト" }).click()
    await page.waitForSelector("#pmw-playlist .playlist-items-container .info-card", { timeout: 10000 })

    // 現在の動画(sm0)が先頭に巡回され、残りは検索順のまま並ぶ
    const queueCards = page.locator("#pmw-playlist .playlist-items-container .info-card")
    await expect(queueCards).toHaveCount(3)
    await expect(queueCards.first()).toHaveAttribute("data-nowplaying", "true")
    await expect(queueCards.first()).toContainText("For testing purposes only")
    await expect(queueCards.nth(1)).toContainText("検索結果の1番目")
    await expect(queueCards.nth(2)).toContainText("検索結果の2番目")
})
