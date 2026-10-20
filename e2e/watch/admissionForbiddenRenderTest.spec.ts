import { expect, test } from "../fixtures"

test("Watch: Admission forbidden video rendering test", async ({ page, mockApi }) => {
    await mockApi()

    await page.goto("https://www.nicovideo.jp/watch/so31960146")
    await page.bringToFront()

    await page.waitForSelector("#pmw-element-video")

    await expect(page.locator(".videotitle")).toHaveText("For Admission testing purpose only")

    // 未ログイン状態なので「ログインが必要です」と Admission の案内の両方の p が出るため絞る
    await expect(page.getByRole("paragraph").filter({ hasText: "未加入のため視聴できません。" })).toBeVisible()
    await expect(page.locator("#pmw-player")).toContainText("利用可能な代替チャンネルは見つかりませんでした")
    await expect(page.getByText("未購入のためコメントできません")).toBeVisible()
})
