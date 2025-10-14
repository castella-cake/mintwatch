import { expect, test } from "../../fixtures"

test("Search: User search data validation", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/user_search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .useritem-card", { timeout: 10000 })

    // モックデータと一致することを詳細に確認
    const userCard = page.locator(".useritem-card").first()

    // ユーザーIDをhref属性から確認
    const href = await userCard.getAttribute("href")
    expect(href).toContain("0") // ユーザーID: 0

    // ユーザー名確認
    const userName = await userCard.locator(".useritem-nickname").textContent()
    expect(userName).toBe("TestUser 0")

    // ユーザー説明確認
    const description = await userCard.locator(".useritem-strippeddesc").textContent()
    expect(description).toBe("TestUser Desc")

    // フォロワー数確認
    const followerCountItem = userCard.locator(".useritem-count-item").filter({ hasText: "フォロワー" })
    await expect(followerCountItem).toBeVisible()
    const followerCount = await followerCountItem.textContent()
    expect(followerCount).toContain("0")

    // 投稿動画数確認
    const videoCountItem = userCard.locator(".useritem-count-item").filter({ hasText: "動画" })
    await expect(videoCountItem).toBeVisible()
    const videoCount = await videoCountItem.textContent()
    expect(videoCount).toContain("0")

    // 生放送番組数確認
    const liveCountItem = userCard.locator(".useritem-count-item").filter({ hasText: "番組" })
    await expect(liveCountItem).toBeVisible()
    const liveCount = await liveCountItem.textContent()
    expect(liveCount).toContain("0")

    // 検索キーワードが正しく表示されていることを確認
    const searchKeyword = await page.locator(".search-title strong").first().textContent()
    expect(searchKeyword).toBe("TEST")

    // 検索結果数確認
    const totalCount = await page.locator(".search-title-totalcount strong").textContent()
    expect(totalCount).toBe("1")
})

test("Search: User search sort options validation", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/user_search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .useritem-card", { timeout: 10000 })

    // ソートセレクターの確認
    const sortSelect = page.locator("select.search-sortkey-selector")
    await expect(sortSelect).toBeVisible()

    // デフォルトのソート値確認（あなたへのおすすめ）
    const defaultSortValue = await sortSelect.inputValue()
    expect(defaultSortValue).toBe("_personalized")

    // ユーザー検索特有のソートオプションの存在確認
    const sortOptions = await page.locator(".search-sortkey-selector option").allTextContents()
    expect(sortOptions).toContain("あなたへのおすすめ")
    expect(sortOptions).toContain("フォロワー数")
    expect(sortOptions).toContain("投稿動画数")
    expect(sortOptions).toContain("生放送番組数")

    // ソート順ボタンの確認
    const orderButtons = page.locator(".search-sortorder-selector")
    await expect(orderButtons).toHaveCount(2)

    // デフォルトで降順が選択されていることを確認
    const activeOrderButton = page.locator(".search-sortorder-selector[data-is-active='true']")
    await expect(activeOrderButton).toBeVisible()
})
