import { expect, test } from "../fixtures"

test("Ranking: Custom rendering test", async ({ page, mockApi, enableRankingPage }) => {
    await mockApi()
    await enableRankingPage()

    await page.goto("https://www.nicovideo.jp/ranking/custom")
    await page.bringToFront()

    await page.waitForSelector(".reshogi-container")

    await expect(page.locator("#root-pmw")).toContainText("For testing purposes only")
})
