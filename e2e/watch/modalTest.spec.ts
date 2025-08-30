import { expect, test } from "../fixtures"

test("Watch: Modal open test", async ({ page, mockApi }) => {
    await mockApi()

    await page.goto("https://www.nicovideo.jp/watch/sm0")
    await page.bringToFront()

    await page.waitForSelector("#pmw-element-video")

    await page.getByRole("button", { name: "閉じる" }).click()

    await page.locator("#pmw-videoactions").getByRole("button", { name: "マイリスト" }).click()

    await expect(page.locator("#pmw-mylists")).toContainText("視聴中の動画をマイリストに追加For testing purpose only を追加します")
    await expect(page.locator("#pmw-mylists")).toContainText("TestMylist 0")
    await expect(page.locator("#pmw-mylists")).toContainText("非公開のマイリスト")
    await expect(page.locator("#pmw-mylists")).toContainText("TestMylist 1")
    await expect(page.locator("#pmw-mylists")).toContainText("公開のマイリスト")

    await page.getByText("共有").click()
    await expect(page.locator("#root-pmw")).toContainText("視聴中の動画をソーシャルネットワークに共有インテントリンクまたは直接リンクを使用してお使いのSNSにリンクを共有できます")
    await expect(page.locator("#root-pmw")).toContainText("For testing purpose only - by CYakigasi https://www.nicovideo.jp/watch/sm0 #sm0 #ニコニコ動画 #PepperMintShare")

    await page.getByRole("button", { name: "NGコメント設定" }).click()
    await expect(page.locator(".modal-content")).toBeVisible()

    await page.locator(".modal-close").click()
})
