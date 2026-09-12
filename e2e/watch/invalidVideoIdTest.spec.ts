import { expect, test } from "../fixtures"

test("Watch: 無効な動画IDではErrorUIが表示される", async ({ page, mockApi }) => {
    await mockApi()

    // validateVideoId で弾かれるID (sm0) はAPIを叩かずエラー状態になる
    await page.goto("https://www.nicovideo.jp/watch/sm0")
    await page.bringToFront()

    await page.waitForSelector(".errorinfo-container", { timeout: 10000 })

    await expect(page.locator(".errorinfo-container .videotitle")).toContainText("指定された動画IDは無効です")
})
