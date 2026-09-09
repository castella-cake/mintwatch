import { expect, test } from "../fixtures"

test("Recommendations: Basic rendering test", async ({ page, mockApi, enableRecommendationsPage }) => {
    await mockApi()
    await enableRecommendationsPage()

    await page.goto("https://www.nicovideo.jp/recommendations")
    await page.bringToFront()

    // コンテナが表示される
    await page.waitForSelector(".recommendations-container")

    // タグセクションに reason.tag が反映される (テストタグ1, テストタグ2)
    await expect(page.locator(".recommendations-relatedtags-tag").first()).toContainText("テストタグ")

    // 動画リストが表示される
    await expect(page.locator(".recommendations-videolist .videoitem-card").first()).toBeVisible()

    // 連続再生ボタンが表示される
    await expect(page.locator(".search-continuous-play-button")).toBeVisible()
})
