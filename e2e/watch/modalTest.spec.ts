import { expect, test } from "../fixtures"

test("Watch: Modal open test", async ({ page, mockApi }) => {
    await mockApi()

    await page.goto("https://www.nicovideo.jp/watch/sm0")
    await page.bringToFront()

    await page.waitForSelector("#pmw-element-video")

    await page.getByRole("button", { name: "閉じる" }).click()

    // 動画アクション→MintWatch ヘルプ→各ページへ
    await page.locator("#pmw-videoactions").getByRole("button", { name: "マイリスト" }).click()
    await expect(page.getByRole("heading", { name: "動画アクション" })).toBeVisible()

    await page.getByRole("button", { name: "MintWatch ヘルプ" }).click()
    await expect(page.getByRole("heading", { name: "ヘルプ" })).toBeVisible()

    await page.getByRole("button", { name: "設定", exact: true }).click()
    await expect(page.locator(".modal-content")).toBeVisible()

    await page.getByText("更新情報").click()
    await expect(page.getByText("過去の更新情報")).toBeVisible()

    await page.getByRole("button", { name: "ショートカット", exact: true }).click()
    await expect(page.locator(".pmw-keyboard-dance")).toBeVisible()

    await page.getByRole("button", { name: "はじめに", exact: true }).click()
    await expect(page.locator(".pmw-help-content")).toBeVisible()

    await page.getByRole("button", { name: "MintWatch について" }).click()
    await expect(page.locator(".about-mintwatch-header")).toBeVisible()

    await page.locator(".modal-container").getByRole("button", { name: "閉じる" }).click()

    // ナビゲーションバーの各ボタンからモーダルを直接開く
    await page.locator(".navbar-helptool-container").getByRole("button", { name: "更新情報", exact: true }).click()
    await expect(page.getByText("過去の更新情報")).toBeVisible()
    await page.locator(".modal-container").getByRole("button", { name: "閉じる" }).click()

    await page.locator(".navbar-helptool-container").getByRole("button", { name: "キーボードショートカット", exact: true }).click()
    await expect(page.locator(".pmw-keyboard-dance")).toBeVisible()
    await page.locator(".modal-container").getByRole("button", { name: "閉じる" }).click()

    await page.locator(".navbar-helptool-container").getByRole("button", { name: "MintWatch のはじめに", exact: true }).click()
    await expect(page.getByText("MintWatch のはじめに MintWatch")).toBeVisible()
    await page.locator(".modal-container").getByRole("button", { name: "閉じる" }).click()

    // MintWatch のクイック設定から開く
    await page.getByRole("button", { name: "MintWatch の設定" }).click()
    await page.getByRole("button", { name: "モーダルで開く" }).click()
    await expect(page.locator(".modal-content")).toBeVisible()
})
