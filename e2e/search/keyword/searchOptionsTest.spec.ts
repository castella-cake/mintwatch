import { expect, test } from "../../fixtures"

test("Search: Keyword search options validation", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/search/TEST")
    await page.bringToFront()

    // 検索結果が表示されるまで待機
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    // ソートセレクターの詳細確認
    const sortSelect = page.locator("select.search-sortkey-selector")
    await expect(sortSelect).toBeVisible()

    // デフォルトのソート値確認
    const defaultSortValue = await sortSelect.inputValue()
    expect(defaultSortValue).toBe("hotLikeAndMylist")

    // ソートオプションの存在確認
    const sortOptions = await page.locator(".search-sortkey-selector option").allTextContents()
    expect(sortOptions).toContain("ニコニコで人気")
    expect(sortOptions).toContain("あなたへのおすすめ")
    expect(sortOptions).toContain("投稿日時")
    expect(sortOptions).toContain("再生数")
    expect(sortOptions).toContain("コメント日時")
    expect(sortOptions).toContain("いいね！数")
    expect(sortOptions).toContain("コメント数")
    expect(sortOptions).toContain("マイリスト登録数")
    expect(sortOptions).toContain("再生時間")

    // ソート順ボタンの確認
    const orderButtons = page.locator(".search-sortorder-selector")
    await expect(orderButtons).toHaveCount(2)

    // デフォルトで降順が選択されていることを確認
    const activeOrderButton = page.locator(".search-sortorder-selector[data-is-active='true']")
    await expect(activeOrderButton).toBeVisible()

    // フィルター設定を開く
    await page.locator(".search-filters-summary").click()

    // 各フィルタープリセットの存在確認
    const filterPresets = [
        "動画種別",
        "再生時間",
        "投稿日時",
        "ジャンル",
    ]

    for (const presetLabel of filterPresets) {
        const preset = page.locator(".search-preset").filter({ hasText: presetLabel })
        await expect(preset).toBeVisible()

        // デフォルトで「指定なし」が選択されていることを確認
        const activeFilter = preset.locator(".search-preset-selector[data-is-active='true']")
        const activeText = await activeFilter.textContent()
        expect(activeText).toBe("指定なし")
    }

    // ジャンルオプションの詳細確認
    const genrePreset = page.locator(".search-preset").filter({ hasText: "ジャンル" })
    const genreOptions = [
        "指定なし",
        "エンターテイメント",
        "ラジオ",
        "音楽・サウンド",
        "ダンス",
        "動物",
        "自然",
        "料理",
        "旅行・アウトドア",
        "乗り物",
        "スポーツ",
        "社会・政治・時事",
        "技術・工作",
        "解説・講座",
        "アニメ",
        "ゲーム",
        "その他",
        "例のソレ",
    ]

    for (const genre of genreOptions) {
        const genreOption = genrePreset.locator(".search-preset-selector").filter({ hasText: genre })
        await expect(genreOption).toBeVisible()
    }

    // 表示オプションの確認
    const displayOptions = page.locator(".search-option-switcher[data-switcher-type='display']")
    await expect(displayOptions).toBeVisible()

    const displayButtons = displayOptions.locator("button")
    await expect(displayButtons).toHaveCount(2)
})
