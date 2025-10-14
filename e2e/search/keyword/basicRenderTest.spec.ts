import { expect, test } from "../../fixtures"

test("Search: Basic keyword search rendering test", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    // 検索キーワードが表示されているか確認
    const searchKeywordText = await page.locator(".search-title strong").first().textContent()
    expect(searchKeywordText).toBe("TEST")

    // 検索結果の動画タイトルが正しく表示されているか確認
    const videoTitle = await page.locator(".info-card-title").first().textContent()
    expect(videoTitle).toBe("For testing purposes only")

    // 投稿者名が正しく表示されているか確認
    const ownerName = await page.locator(".genericitem-owner-name").first().textContent()
    expect(ownerName).toBe("CYakigasi")

    // 動画説明が表示されているか確認
    const description = await page.locator(".info-card-desc").first().textContent()
    expect(description).toContain("TestDescriptionThatJustForTesting")

    // 検索結果数が正しく表示されているか確認
    const totalCount = await page.locator(".search-title-totalcount strong").textContent()
    expect(totalCount).toBe("1")

    // 検索フォームにキーワード検索が選択されていることを確認
    const activeSearchType = page.locator(".searchbox-type-active[data-searchtype='search']")
    await expect(activeSearchType).toBeVisible()
})
