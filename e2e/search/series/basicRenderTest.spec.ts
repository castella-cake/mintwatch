import { expect, test } from "../../fixtures"

test("Search: Basic series search rendering test", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/series_search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .mylistitem-card", { timeout: 10000 })

    // 検索キーワードが表示されているか確認
    const searchKeywordText = await page.locator(".search-title strong").first().textContent()
    expect(searchKeywordText).toBe("TEST")

    // 検索結果のシリーズタイトルが正しく表示されているか確認
    const seriesTitle = await page.locator(".info-card-content-title").first().textContent()
    expect(seriesTitle).toBe("TestMylist 0")

    // 投稿者名が正しく表示されているか確認
    const ownerName = await page.locator(".genericitem-owner-name").first().textContent()
    expect(ownerName).toBe("CYakigasi")

    // 動画数が表示されているか確認
    const videoCount = await page.locator(".info-card-counts strong").first().textContent()
    expect(videoCount).toBe("1")

    // 検索結果数が正しく表示されているか確認
    const totalCount = await page.locator(".search-title-totalcount strong").textContent()
    expect(totalCount).toBe("1")

    // 検索フォームにシリーズ検索が選択されていることを確認
    const activeSearchType = page.locator(".searchbox-type-active[data-searchtype='series']")
    await expect(activeSearchType).toBeVisible()
})
