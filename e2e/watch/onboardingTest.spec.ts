import { expect, test } from "../fixtures"

test("Watch: Onboarding test", async ({ page, mockApi }) => {
    await mockApi()

    await page.goto("https://www.nicovideo.jp/watch/sm0")
    await page.bringToFront()

    await page.waitForSelector("#pmw-element-video")

    await page.getByRole("button", { name: "次のステップへ" }).click()

    await page.getByRole("button", { name: "Re:cresc" }).click()
    await expect(page.locator(".watch-container")).toHaveAttribute("data-watch-type", "recresc")

    await page.getByRole("button", { name: "Re:新視聴" }).click()
    await expect(page.locator(".watch-container")).toHaveAttribute("data-watch-type", "renew")

    await page.getByRole("button", { name: "Shinjuku" }).click()
    await expect(page.locator(".watch-container")).toHaveAttribute("data-watch-type", "shinjuku")

    await page.getByRole("button", { name: "次のステップへ" }).click()

    await page.getByRole("button", { name: "MintWatch", exact: true }).click()
    await expect(page.locator(".player-container")).toHaveAttribute("data-player-type", "default")

    await page.getByRole("button", { name: "HTML5" }).click()
    await expect(page.locator(".player-container")).toHaveAttribute("data-player-type", "html5")

    await page.getByRole("button", { name: "GINZA+" }).click()
    await expect(page.locator(".player-container")).toHaveAttribute("data-player-type", "ginzaplus")

    await page.getByRole("button", { name: "Shinjuku" }).click()
    await expect(page.locator(".player-container")).toHaveAttribute("data-player-type", "shinjuku")

    await page.getByRole("button", { name: "次のステップへ" }).click()

    await page.getByRole("button", { name: "Re:turn以降" }).click()

    await page.getByRole("button", { name: "eR以前" }).click()

    await page.getByRole("button", { name: "次のステップへ" }).click()

    await page.getByRole("button", { name: "かため" }).click()
    await expect(page.locator(".container")).toHaveAttribute("data-layout-density", "compact")

    await page.getByRole("button", { name: "ふつう" }).click()
    await expect(page.locator(".container")).toHaveAttribute("data-layout-density", "default")

    await page.getByRole("button", { name: "やわめ" }).click()
    await expect(page.locator(".container")).toHaveAttribute("data-layout-density", "comfort")

    await page.getByRole("button", { name: "次のステップへ" }).click()

    await page.getByRole("button", { name: "自動設定" }).click()
    await expect(page.locator("html")).toHaveAttribute("data-mw-palette", "default")

    await page.getByRole("button", { name: "ライト" }).click()
    await expect(page.locator("html")).toHaveAttribute("data-mw-palette", "light")

    await page.getByRole("button", { name: "ダーク" }).click()
    await expect(page.locator("html")).toHaveAttribute("data-mw-palette", "dark")

    await page.getByRole("button", { name: "次のステップへ" }).click()

    await page.getByRole("button", { name: "MintWatch のはじめに" }).click()
    await expect(page.getByRole("heading", { name: "ヘルプ" })).toBeVisible()
})
