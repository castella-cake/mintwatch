import { expect, test } from "../fixtures"

test("Watch: Forbidden video rendering test", async ({ page, mockApi }) => {
    await mockApi()

    await page.goto("https://www.nicovideo.jp/watch/sm1")
    await page.bringToFront()

    await page.waitForSelector("#pmw-element-video")

    await expect(page.locator(".videotitle")).toHaveText("400 FORBIDDEN: 削除された動画のため視聴できません")
})
