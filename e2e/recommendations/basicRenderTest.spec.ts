import { expect, test } from "../fixtures"

test("Recommendations: Basic rendering test", async ({ page, mockApi, enableRecommendationsPage }) => {
    await mockApi()
    await enableRecommendationsPage()

    await page.goto("https://www.nicovideo.jp/recommendations")
    await page.bringToFront()

    // コンテナが表示される
    await page.waitForSelector(".recommendations-container")

    // タイトルに件数 (テストデータ 3 件) が反映される
    await expect(page.locator(".recommendations-title")).toContainText("おすすめの動画")
    await expect(page.locator(".recommendations-title-totalcount")).toContainText("3")

    // タグセクションに reason.tag が反映される (テストタグ1, テストタグ2)
    await expect(page.locator(".generic-relatedtags-tag").first()).toContainText("テストタグ")

    // 動画リストが表示される
    await expect(page.locator(".recommendations-videolist .videoitem-card").first()).toBeVisible()

    // 連続再生ボタンがヘッダに表示される (フラグが消えたら戻す)
    // await expect(page.locator(".recommendations-header .generic-continuous-play-button")).toBeVisible()
})
