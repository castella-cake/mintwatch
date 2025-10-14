import { expect, test } from "../../fixtures"

test("Search: Basic tag search rendering test", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/tag/testtag")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    // 検索タグが表示されているか確認
    const searchTagText = await page.locator(".search-title strong").first().textContent()
    expect(searchTagText).toBe("てすと")

    // ニコニコ大百科の情報が表示されているか確認
    const nicodicContainer = page.locator(".search-nicodic-container")
    await expect(nicodicContainer).toBeVisible()

    const nicodicSummary = await page.locator(".search-nicodic-summary").textContent()
    expect(nicodicSummary).toContain("→みんなのトラウマ")

    const nicodicLink = page.locator(".search-nicodic-link")
    await expect(nicodicLink).toBeVisible()
    const nicodicUrl = await nicodicLink.getAttribute("href")
    expect(nicodicUrl).toBe("https://dic.nicovideo.jp/a/%E3%83%86%E3%82%B9%E3%83%88")

    // 関連タグが表示されているか確認
    const relatedTagsSection = page.locator(".search-result-relatedtags")
    await expect(relatedTagsSection).toBeVisible()

    const relatedTag = await page.locator(".search-result-relatedtags-tag").first().textContent()
    expect(relatedTag).toBe("MintWatchの楽しみは無限大です")

    // 動画タイトルが正しく表示されているか確認
    const videoTitle = await page.locator(".info-card-title").first().textContent()
    expect(videoTitle).toBe("For testing purposes only")

    // 検索コンテナがニコニコ大百科有効フラグを持っているか確認
    const searchContainer = page.locator(".search-container")
    const hasNicodicFlag = await searchContainer.getAttribute("data-is-nicodic-article-exists")
    expect(hasNicodicFlag).toBe("true")

    // 検索フォームにタグ検索が選択されていることを確認
    const activeSearchType = page.locator(".searchbox-type-active[data-searchtype='tag']")
    await expect(activeSearchType).toBeVisible()
})
