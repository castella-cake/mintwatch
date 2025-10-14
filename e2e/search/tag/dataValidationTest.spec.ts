import { expect, test } from "../../fixtures"

test("Search: Tag search data validation", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/tag/テスト")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    // ニコニコ大百科情報の詳細確認
    const nicodicSection = page.locator(".search-nicodic-container")
    await expect(nicodicSection).toBeVisible()

    // ニコニコ大百科の要約文確認
    const nicodicSummary = await page.locator(".search-nicodic-summary").textContent()
    expect(nicodicSummary).toContain("→みんなのトラウマ")
    expect(nicodicSummary).toContain("テストとは、英語のtestのカタカナ表記である")

    // ニコニコ大百科のURL確認
    const nicodicLink = page.locator(".search-nicodic-link")
    const nicodicUrl = await nicodicLink.getAttribute("href")
    expect(nicodicUrl).toBe("https://dic.nicovideo.jp/a/%E3%83%86%E3%82%B9%E3%83%88")

    // 関連タグセクション確認
    const relatedTagsSection = page.locator(".search-result-relatedtags")
    await expect(relatedTagsSection).toBeVisible()

    // 関連タグの内容確認
    const relatedTag = page.locator(".search-result-relatedtags-tag").first()
    await expect(relatedTag).toBeVisible()

    const relatedTagText = await relatedTag.textContent()
    expect(relatedTagText).toBe("MintWatchの楽しみは無限大です")

    // 検索結果の詳細データ確認（キーワード検索と同じ動画データ）
    const videoCard = page.locator(".videoitem-card").first()

    // 同じ動画データが表示されることを確認
    const title = await videoCard.locator(".info-card-title").textContent()
    expect(title).toBe("For testing purposes only")

    // 検索メタデータ確認
    const searchKeyword = await page.locator(".search-title strong").first().textContent()
    expect(searchKeyword).toBe("てすと")

    // ページネーション情報確認（タグ検索は件数が多い）
    const totalCount = await page.locator(".search-title-totalcount strong").textContent()
    expect(totalCount).toBe("1") // モックデータでは1件

    // 検索コンテナがニコニコ大百科記事存在フラグを持っていることを確認
    const searchContainer = page.locator(".search-container")
    const hasNicodicFlag = await searchContainer.getAttribute("data-is-nicodic-article-exists")
    expect(hasNicodicFlag).toBe("true")
})

test("Search: Container attributes validation for tag search", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    // タグ検索での属性確認
    await page.goto("https://www.nicovideo.jp/tag/テスト")
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    const tagSearchContainer = page.locator(".search-container")

    // ニコニコ大百科記事が存在することを確認（タグ検索）
    const tagNicodicFlag = await tagSearchContainer.getAttribute("data-is-nicodic-article-exists")
    expect(tagNicodicFlag).toBe("true")

    // フェッチ状態の確認
    const isFetching = await tagSearchContainer.getAttribute("data-is-fetching")
    expect(isFetching).toBe("false")

    // 検索結果アイテムコンテナの属性確認
    const searchResultItems = page.locator(".search-result-items")
    const gridLayout = await searchResultItems.getAttribute("data-is-grid-layout")
    expect(gridLayout).toBe("false") // デフォルトはリスト表示

    // 各動画カードのdata-index属性確認
    const firstVideoCard = page.locator(".videoitem-card").first()
    const dataIndex = await firstVideoCard.getAttribute("data-index")
    expect(dataIndex).toBe("1")
})
