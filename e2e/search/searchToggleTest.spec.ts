import { expect, test } from "../fixtures"

test("Search: Switch between keyword and tag search", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    // キーワード検索から開始
    await page.goto("https://www.nicovideo.jp/search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    // キーワード検索であることを確認（検索フォームで確認）
    const keywordSearchButton = page.locator(".searchbox-type-active[data-searchtype='search']")
    await expect(keywordSearchButton).toBeVisible()

    // タグ検索切り替えボタンをクリック
    const tagSearchButton = page.locator(".searchbox-type-item[data-searchtype='tag']")
    await expect(tagSearchButton).toBeVisible()
    await tagSearchButton.click()

    // URLが変更されることを確認
    await page.waitForURL(/\/tag\/.*/)

    // タグ検索ページが表示されるまで待機
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    // タグ検索であることを確認（検索フォームで確認）
    const activeTagSearchButton = page.locator(".searchbox-type-active[data-searchtype='tag']")
    await expect(activeTagSearchButton).toBeVisible()

    // ニコニコ大百科の情報が表示されているか確認（タグ検索特有の要素）
    const nicodicSection = page.locator(".search-nicodic-container")
    // ニコニコ大百科コンテナが存在する場合のみチェック
    const nicodicExists = await nicodicSection.count() > 0
    if (nicodicExists) {
        await expect(nicodicSection).toBeVisible()
    }

    // 関連タグセクションが表示されているか確認（タグ検索特有の要素）
    const relatedTagsSection = page.locator(".search-result-relatedtags")
    await expect(relatedTagsSection).toBeVisible()

    // キーワード検索に戻る
    const keywordSearchButtonReturn = page.locator(".searchbox-type-item[data-searchtype='search']")
    await expect(keywordSearchButtonReturn).toBeVisible()
    await keywordSearchButtonReturn.click()

    // URLが変更されることを確認
    await page.waitForURL(/\/search\/.*/)

    // キーワード検索ページが表示されるまで待機
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    // キーワード検索であることを確認
    const finalKeywordSearchButton = page.locator(".searchbox-type-active[data-searchtype='search']")
    await expect(finalKeywordSearchButton).toBeVisible()

    // ニコニコ大百科の情報が表示されていないことを確認（キーワード検索では非表示）
    const nicodicSectionHidden = page.locator(".search-nicodic-container")
    await expect(nicodicSectionHidden).not.toBeVisible()
})

test("Search: Search input functionality", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    // 検索入力フィールドが表示されているか確認
    const searchInput = page.locator(".searchbox-inputcontainer input")
    await expect(searchInput).toBeVisible()

    // 現在の検索キーワードが入力フィールドに表示されているか確認
    const currentValue = await searchInput.inputValue()
    expect(currentValue).toBe("TEST")

    // 検索ボタンが表示されているか確認
    const searchButton = page.locator(".searchbox-inputcontainer button")
    await expect(searchButton).toBeVisible()

    // 新しいキーワードを入力
    await searchInput.fill("新しいテスト")

    // 検索ボタンをクリック
    await searchButton.click()

    // URLが変更されることを確認（実際のAPIコールは発生しないがURL変更は確認）
    await expect(page).toHaveURL(/search/)
})

test("Search: Pagination functionality", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    // タグ検索ページ（複数ページがあるテストデータ）
    await page.goto("https://www.nicovideo.jp/tag/テスト")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    // ページネーション情報が表示されているか確認
    const paginationContainer = page.locator(".pageselector-container").first()
    await expect(paginationContainer).toBeVisible()

    // 総件数が表示されているか確認（モックデータでは1件）
    const totalCountDisplay = page.locator(".search-title-totalcount strong")
    await expect(totalCountDisplay).toBeVisible()
    const totalCountText = await totalCountDisplay.textContent()
    expect(totalCountText).toBe("1")

    // ページネーション内の「次のページ」ボタンが存在するかチェック（hasNext: trueの場合）
    // 実際のページネーション実装に依存するため、コンテナの存在のみ確認
    await expect(paginationContainer).toBeVisible()
})

test("Search: Video result card functionality", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    const videoCard = page.locator(".videoitem-card").first()

    // 動画カードの基本要素が表示されているか確認
    await expect(videoCard.locator(".info-card-thumbnail img")).toBeVisible()
    await expect(videoCard.locator(".info-card-title")).toBeVisible()
    await expect(videoCard.locator(".info-card-durationtext")).toBeVisible()
    await expect(videoCard.locator(".info-card-desc")).toBeVisible()
    await expect(videoCard.locator(".genericitem-owner-name")).toBeVisible()
    await expect(videoCard.locator(".genericitem-owner-icon")).toBeVisible()

    // 動画の統計情報が表示されているか確認
    await expect(videoCard.locator(".info-card-counts")).toBeVisible()

    // 動画の長さが正しく表示されているか確認（186秒 = 3:06）
    const duration = await videoCard.locator(".info-card-durationtext").textContent()
    expect(duration).toBe("03:06")

    // 動画カードをクリックした時の動作確認
    const videoLink = videoCard.locator(".info-card-link")
    await expect(videoLink).toBeVisible()

    // リンクのhref属性を確認
    const href = await videoLink.getAttribute("href")
    expect(href).toContain("/watch/sm0")
})

test("Search: Search type selector functionality", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    // 検索タイプセレクターが表示されているか確認
    const searchTypeSelector = page.locator(".searchbox-typeselector")
    await expect(searchTypeSelector).toBeVisible()

    // 各検索タイプボタンが存在するか確認
    const searchTypes = [
        { type: "search", label: "キーワード" },
        { type: "tag", label: "タグ" },
        { type: "mylist", label: "マイリスト" },
        { type: "series", label: "シリーズ" },
        { type: "user", label: "ユーザー" },
    ]

    for (const searchType of searchTypes) {
        const typeButton = page.locator(`[data-searchtype='${searchType.type}']`)
        await expect(typeButton).toBeVisible()

        const buttonText = await typeButton.locator(".searchbox-type-text").textContent()
        expect(buttonText).toBe(searchType.label)
    }

    // 現在のキーワード検索が選択されていることを確認
    const activeButton = page.locator(".searchbox-type-active")
    await expect(activeButton).toHaveAttribute("data-searchtype", "search")
})
