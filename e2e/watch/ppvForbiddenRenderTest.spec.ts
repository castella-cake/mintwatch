import { expect, test } from "../fixtures"

test("Watch: PPV forbidden video rendering test", async ({ page, mockApi }) => {
    await mockApi()

    await page.goto("https://www.nicovideo.jp/watch/so1")
    await page.bringToFront()

    await page.waitForSelector("#pmw-element-video")

    await expect(page.locator(".videotitle")).toHaveText("For PPV testing purpose only")

    await expect(page.getByRole("paragraph")).toContainText("未レンタルのため視聴できません。")
    await expect(page.locator("#pmw-player")).toContainText("利用可能な代替チャンネルは見つかりませんでした")
    await expect(page.getByText("未購入のためコメントできません")).toBeVisible()
})
