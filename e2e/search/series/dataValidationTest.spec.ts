import { expect, test } from "../../fixtures"

test("Search: Series search data validation", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/series_search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .mylistitem-card", { timeout: 10000 })

    // モックデータと一致することを詳細に確認
    const listCard = page.locator(".mylistitem-card").first()

    // シリーズIDをhref属性から確認
    const listLink = listCard.locator(".info-card-link")
    const href = await listLink.getAttribute("href")
    expect(href).toContain("series/0") // シリーズID: 0

    // タイトル確認
    const title = await listCard.locator(".info-card-content-title").textContent()
    expect(title).toBe("TestMylist 0")

    // 投稿者情報確認
    const ownerName = await listCard.locator(".genericitem-owner-name").textContent()
    expect(ownerName).toBe("CYakigasi")

    const ownerLink = listCard.locator(".genericitem-owner")
    const ownerHref = await ownerLink.getAttribute("href")
    expect(ownerHref).toContain("92343354")

    // 動画数確認
    const videoCountText = await listCard.locator(".info-card-counts").textContent()
    expect(videoCountText).toContain("1")
    expect(videoCountText).toContain("件の動画")

    // ユーザータイプであることを確認（チャンネルではない）
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

test("Search: Series search sort options validation", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/series_search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .mylistitem-card", { timeout: 10000 })

    // ソートセレクターの確認
    const sortSelect = page.locator("select.search-sortkey-selector")
    await expect(sortSelect).toBeVisible()

    // デフォルトのソート値確認（ニコニコで人気）
    const defaultSortValue = await sortSelect.inputValue()
    expect(defaultSortValue).toBe("_hotTotalScore")

    // シリーズ検索特有のソートオプションの存在確認
    const sortOptions = await page.locator(".search-sortkey-selector option").allTextContents()
    expect(sortOptions).toContain("ニコニコで人気")
    expect(sortOptions).toContain("登録動画数")
    expect(sortOptions).toContain("作成日")
    expect(sortOptions).toContain("動画追加日時")

    // ソート順ボタンの確認
    const orderButtons = page.locator(".search-sortorder-selector")
    await expect(orderButtons).toHaveCount(2)

    // デフォルトで降順が選択されていることを確認
    const activeOrderButton = page.locator(".search-sortorder-selector[data-is-active='true']")
    await expect(activeOrderButton).toBeVisible()
})
