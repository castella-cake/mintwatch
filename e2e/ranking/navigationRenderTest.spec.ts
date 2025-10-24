import { expect, test } from "../fixtures"

test("Ranking: Navigation test", async ({ page, mockApi, enableRankingPage }) => {
    await mockApi()
    await enableRankingPage()

    await page.goto("https://www.nicovideo.jp/ranking/custom")
    await page.bringToFront()

    await page.waitForSelector(".reshogi-container")

    await expect(page.locator("#root-pmw")).toContainText("For testing purposes only")

    // await expect(page.getByRole('link', { name: 'For testing purposes only' })).toBeVisible();
    await expect(page.locator("#root-pmw")).toContainText("For testing purposes only")
    await expect(page.getByRole("link", { name: "メイン" })).toHaveAttribute("data-is-active", "true")
    await expect(page.getByRole("link", { name: "総合ランキング" })).toHaveAttribute("data-is-active", "false")

    await page.getByRole("link", { name: "総合ランキング" }).click()
    await expect(page.getByRole("link", { name: "メイン" })).toHaveAttribute("data-is-active", "false")
    await expect(page.getByRole("link", { name: "総合ランキング" })).toHaveAttribute("data-is-active", "true")

    await expect(page.locator("#root-pmw")).toContainText("For testing purposes only")
    await expect(page.locator("#root-pmw")).toContainText("ジャンル総合")
    await expect(page.locator("#root-pmw")).toContainText("ページ 1 - 計 10 件中 1 件")
})
