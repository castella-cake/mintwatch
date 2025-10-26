import { expect, test } from "../../fixtures"

test("Search: Keyword search data validation", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    // モックデータと一致することを詳細に確認
    const videoCard = page.locator(".videoitem-card").first()

    // 動画IDをhref属性から確認
    const videoLink = videoCard.locator(".info-card-link")
    const href = await videoLink.getAttribute("href")
    expect(href).toContain("sm0")

    // タイトル確認
    const title = await videoCard.locator(".info-card-title").textContent()
    expect(title).toBe("For testing purposes only")

    // 投稿者情報確認
    const ownerName = await videoCard.locator(".genericitem-owner-name").textContent()
    expect(ownerName).toBe("CYakigasi")

    const ownerLink = videoCard.locator(".genericitem-owner")
    const ownerHref = await ownerLink.getAttribute("href")
    expect(ownerHref).toContain("92343354")

    // 説明文確認
    const description = await videoCard.locator(".info-card-desc").textContent()
    expect(description).toBe("TestDescriptionThatJustForTesting")

    // サムネイルURL確認
    const thumbnail = videoCard.locator(".info-card-thumbnail img")
    const thumbnailSrc = await thumbnail.getAttribute("src")
    expect(thumbnailSrc).toContain("https://nicovideo.cdn.nimg.jp/thumbnails/9/9")

    // 動画の長さ確認（186秒 = 3:06）
    const duration = await videoCard.locator(".info-card-durationtext").textContent()
    expect(duration).toBe("03:06")

    // チャンネル動画ではないことを確認（ユーザー投稿）
    const ownerUrl = await ownerLink.getAttribute("href")
    expect(ownerUrl).toContain("/user/")
    expect(ownerUrl).not.toContain("/ch.")

    // 検索キーワードが正しく表示されていることを確認
    const searchKeyword = await page.locator(".search-title strong").first().textContent()
    expect(searchKeyword).toBe("TEST")

    // 検索結果数確認
    const totalCount = await page.locator(".search-title-totalcount strong").textContent()
    expect(totalCount).toBe("1")
})

test("Search: Container attributes validation for keyword search", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    // キーワード検索での属性確認
    await page.goto("https://www.nicovideo.jp/search/TEST")
    await page.bringToFront()

    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    const keywordSearchContainer = page.locator(".search-container")

    // ニコニコ大百科記事が存在しないことを確認（キーワード検索）
    const nicodicFlag = await keywordSearchContainer.getAttribute("data-is-nicodic-article-exists")
    expect(nicodicFlag).toBeNull()

    // フェッチ状態の確認
    const isFetching = await keywordSearchContainer.getAttribute("data-is-fetching")
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
