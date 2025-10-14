import { expect, test } from "../../fixtures"

test("Search: Basic user search rendering test", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/user_search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .useritem-card", { timeout: 10000 })

    // 検索キーワードが表示されているか確認
    const searchKeywordText = await page.locator(".search-title strong").first().textContent()
    expect(searchKeywordText).toBe("TEST")

    // 検索結果のユーザー名が正しく表示されているか確認
    const userName = await page.locator(".useritem-nickname").first().textContent()
    expect(userName).toBe("TestUser 0")

    // ユーザー説明が表示されているか確認
    const userDescription = await page.locator(".useritem-strippeddesc").first().textContent()
    expect(userDescription).toContain("TestUser Desc")

    // フォロワー数が表示されているか確認
    const followerCountLabel = page.locator(".useritem-count-item").filter({ hasText: "フォロワー" }).first()
    await expect(followerCountLabel).toBeVisible()

    // 検索結果数が正しく表示されているか確認
    const totalCount = await page.locator(".search-title-totalcount strong").textContent()
    expect(totalCount).toBe("1")

    // 検索フォームにユーザー検索が選択されていることを確認
    const activeSearchType = page.locator(".searchbox-type-active[data-searchtype='user']")
    await expect(activeSearchType).toBeVisible()
})
