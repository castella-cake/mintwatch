import { expect, test } from "../fixtures"

test("Watch: ToolTip rendering test", async ({ page, mockApi }) => {
    await mockApi()

    await page.goto("https://www.nicovideo.jp/watch/sm0")
    await page.bringToFront()

    await page.waitForSelector("#pmw-element-video")

    await page.getByRole("button", { name: "再生", exact: true }).hover()
    await expect(page.getByRole("tooltip")).toHaveText("再生")

    await page.mouse.move(0, 0)
    await expect(page.getByRole("tooltip")).toBeHidden()
})

test("Watch: ToolTip does not appear on programmatic focus when opening the sidemenu", async ({ page, extensionId }) => {
    // 非固定ヘッダー時のみサイドメニューの閉じるボタンが表示・フォーカス可能になる
    await page.goto(`chrome-extension://${extensionId}/settings.html`)
    await page.getByRole("checkbox", { name: "Enable Fixed Header" }).click()
    await page.goto("https://www.nicovideo.jp/watch/sm0")
    await page.bringToFront()
    await page.waitForSelector("#pmw-element-video")

    await page.getByRole("button", { name: "サイドメニューを切り替え" }).click()
    await expect(page.locator(".sidemenu-container")).toBeVisible()

    // ReactFocusLock が閉じるボタンへプログラム的にフォーカスを移してもツールチップを出さない
    await page.waitForTimeout(800)
    await expect(page.getByRole("tooltip")).toHaveCount(0)
})
