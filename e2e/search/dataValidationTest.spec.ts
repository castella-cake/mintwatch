import { expect, test } from "../fixtures"

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

test("Search: Search options validation", async ({ page, mockApi, enableSearchPage }) => {
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

test("Search: Container attributes validation", async ({ page, mockApi, enableSearchPage }) => {
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

    // タグ検索での属性確認
    await page.goto("https://www.nicovideo.jp/tag/テスト")
    await page.waitForSelector(".search-result-items .videoitem-card", { timeout: 10000 })

    const tagSearchContainer = page.locator(".search-container")

    // ニコニコ大百科記事が存在することを確認（タグ検索）
    const tagNicodicFlag = await tagSearchContainer.getAttribute("data-is-nicodic-article-exists")
    expect(tagNicodicFlag).toBe("true")

    // 検索結果アイテムコンテナの属性確認
    const searchResultItems = page.locator(".search-result-items")
    const gridLayout = await searchResultItems.getAttribute("data-is-grid-layout")
    expect(gridLayout).toBe("false") // デフォルトはリスト表示

    // 各動画カードのdata-index属性確認
    const firstVideoCard = page.locator(".videoitem-card").first()
    const dataIndex = await firstVideoCard.getAttribute("data-index")
    expect(dataIndex).toBe("1")
})
