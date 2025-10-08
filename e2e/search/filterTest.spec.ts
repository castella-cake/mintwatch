import { expect, test } from "../fixtures"

test("Search: Filter functionality test", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    // ソート機能のテスト
    const sortDropdown = page.locator("select.search-sortkey-selector")
    await expect(sortDropdown).toBeVisible()

    // デフォルトのソート順が「ニコニコで人気」になっているか確認
    const defaultSort = await sortDropdown.inputValue()
    expect(defaultSort).toBe("hotLikeAndMylist")

    // ソートオプションが存在するか確認
    const sortOptions = await page.locator(".search-sortkey-selector option").allTextContents()
    expect(sortOptions).toContain("ニコニコで人気")
    expect(sortOptions).toContain("あなたへのおすすめ")
    expect(sortOptions).toContain("投稿日時")
    expect(sortOptions).toContain("再生数")
    expect(sortOptions).toContain("コメント数")
    expect(sortOptions).toContain("マイリスト登録数")

    // ソート順の切り替えテスト
    const orderButtons = page.locator(".search-sortorder-selector")
    await expect(orderButtons).toHaveCount(2)

    // デフォルトの並び順が「降順」になっているか確認
    const activeOrderButton = page.locator(".search-sortorder-selector[data-is-active='true']")
    await expect(activeOrderButton).toBeVisible()

    // フィルター設定を開く
    const filterDetails = page.locator(".search-filters")
    await expect(filterDetails).toBeVisible()

    // フィルターを展開
    await page.locator(".search-filters-summary").click()

    // 動画種別フィルターのテスト
    const kindPreset = page.locator(".search-preset").filter({ hasText: "動画種別" })
    await expect(kindPreset).toBeVisible()

    // デフォルトが「指定なし」になっているか確認
    const activeKindFilter = kindPreset.locator(".search-preset-selector[data-is-active='true']")
    const activeKindText = await activeKindFilter.textContent()
    expect(activeKindText).toBe("指定なし")

    // 「ユーザー」と「チャンネル」フィルターオプションが存在するか確認
    const userFilter = kindPreset.locator(".search-preset-selector").filter({ hasText: "ユーザー" })
    await expect(userFilter).toBeVisible()

    const channelFilter = kindPreset.locator(".search-preset-selector").filter({ hasText: "チャンネル" })
    await expect(channelFilter).toBeVisible()

    // 再生時間フィルターのテスト
    const lengthPreset = page.locator(".search-preset").filter({ hasText: "再生時間" })
    await expect(lengthPreset).toBeVisible()

    const activeLengthFilter = lengthPreset.locator(".search-preset-selector[data-is-active='true']")
    const activeLengthText = await activeLengthFilter.textContent()
    expect(activeLengthText).toBe("指定なし")

    // 投稿日時フィルターのテスト
    const datePreset = page.locator(".search-preset").filter({ hasText: "投稿日時" })
    await expect(datePreset).toBeVisible()

    const activeDateFilter = datePreset.locator(".search-preset-selector[data-is-active='true']")
    const activeDateText = await activeDateFilter.textContent()
    expect(activeDateText).toBe("指定なし")

    // ジャンルフィルターのテスト
    const genrePreset = page.locator(".search-preset").filter({ hasText: "ジャンル" })
    await expect(genrePreset).toBeVisible()

    const activeGenreFilter = genrePreset.locator(".search-preset-selector[data-is-active='true']")
    const activeGenreText = await activeGenreFilter.textContent()
    expect(activeGenreText).toBe("指定なし")

    // 各ジャンルオプションが存在するか確認
    const genreOptions = [
        "エンターテイメント",
        "ラジオ",
        "音楽・サウンド",
        "ダンス",
        "動物",
        "ゲーム",
        "アニメ",
    ]

    for (const genre of genreOptions) {
        const genreOption = genrePreset.locator(".search-preset-selector").filter({ hasText: genre })
        await expect(genreOption).toBeVisible()
    }
})

test("Search: Date range filter test", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    // フィルター設定を開く
    await page.locator(".search-filters-summary").click()

    // 投稿日時フィルターで「範囲指定」を選択
    const datePreset = page.locator(".search-preset").filter({ hasText: "投稿日時" })
    const rangeSelector = datePreset.locator(".search-preset-selector").filter({ hasText: "範囲指定" })
    await rangeSelector.click()

    // 日付範囲入力フィールドが表示されるか確認
    const dateRangeContainer = page.locator(".search-date-range")
    await expect(dateRangeContainer).toBeVisible()

    // 開始日と終了日の入力フィールドが存在するか確認
    const startDateInput = dateRangeContainer.locator("input[type='date']").first()
    const endDateInput = dateRangeContainer.locator("input[type='date']").last()

    await expect(startDateInput).toBeVisible()
    await expect(endDateInput).toBeVisible()

    // ラベルが正しいか確認
    const startLabel = await dateRangeContainer.locator("label").first().textContent()
    expect(startLabel).toContain("開始日")

    const endLabel = await dateRangeContainer.locator("label").last().textContent()
    expect(endLabel).toContain("終了日")

    // デフォルトでは日付が設定されていないことを確認
    const startValue = await startDateInput.inputValue()
    const endValue = await endDateInput.inputValue()
    expect(startValue).toBe("")
    expect(endValue).toBe("")
})

test("Search: Display options test", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    // 表示形式切り替えボタンが存在するか確認
    const displaySwitcher = page.locator(".search-option-switcher[data-switcher-type='display']")
    await expect(displaySwitcher).toBeVisible()

    // リスト表示ボタンとグリッド表示ボタンが存在するか確認
    const listButton = displaySwitcher.locator("button").first()
    const gridButton = displaySwitcher.locator("button").last()

    await expect(listButton).toBeVisible()
    await expect(gridButton).toBeVisible()

    // デフォルトでリスト表示が選択されているか確認
    const isListActive = await listButton.getAttribute("data-is-active")
    expect(isListActive).toBe("true")

    // グリッド表示に切り替え
    await gridButton.click()

    // 検索結果コンテナのレイアウト属性が変更されるか確認
    const searchResultItems = page.locator(".search-result-items")
    const gridLayout = await searchResultItems.getAttribute("data-is-grid-layout")
    expect(gridLayout).toBe("true")
})
