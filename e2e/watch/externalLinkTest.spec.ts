import { expect, test } from "../fixtures"

// 視聴ページ内の動画IDを持たないリンク (例: オーナーのユーザーページ) をクリックしたとき、
// 誤って動画リンク扱いされて preventDefault() されず、正規のナビゲーションが起きることを確認する。
// (HEAD@{2} で修正された回帰テスト)
test("Watch: 視聴ページ内の非動画リンクをクリックするとMintWatch外へ遷移する", async ({ page, mockApi }) => {
    await mockApi()

    await page.goto("https://www.nicovideo.jp/watch/sm9")
    await page.bringToFront()

    await page.waitForSelector("#pmw-element-video")

    // 視聴ページ内のオーナーリンク (ユーザーページ) をクリック
    await page.locator(".videoinfo-owner a").click()

    // 視聴ページ外のURLへ実際に遷移していること
    await page.waitForURL("**/user/92343354", { timeout: 10000 })
    await expect(page).not.toHaveURL(/\/watch\//)

    // MintWatch UI が消えていること
    await expect(page.locator("#pmw-element-video")).toHaveCount(0)
})

// target="_blank" リンクは isOutOfBoundsLinkAnchor() で MintWatch のインターセプトから外れ、
// ブラウザ標準の挙動で新しいタブで開かれることを確認する。
test("Watch: target=_blank リンクは新しいタブで開く", async ({ page, mockApi }) => {
    await mockApi()

    await page.goto("https://www.nicovideo.jp/watch/sm9")
    await page.bringToFront()

    await page.waitForSelector("#pmw-element-video")

    // 外部リンクメニューを開く
    await page.locator(".videoinfo-externallink-button").click()
    await expect(page.getByText("公開マイリストの一覧を見る")).toBeVisible()

    // target=_blank のリンクをクリックして新しいページが開くのを待つ
    const newPagePromise = page.context().waitForEvent("page", {
        predicate: newPage => !newPage.url().includes("welcome.html"),
    })
    await page.getByText("公開マイリストの一覧を見る").click()
    const newPage = await newPagePromise

    // 新しいタブが対象リンクの遷移先 (openlist) で開いている
    await newPage.waitForLoadState("domcontentloaded")
    await expect(newPage).toHaveURL(/\/openlist\/sm9/)

    // 元のページは視聴ページから遷移していない
    await expect(page).toHaveURL(/\/watch\/sm9/)
    await expect(page.locator("#pmw-element-video")).toBeVisible()
})
