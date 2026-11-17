import { expect, test } from "../../fixtures"

test("Search: ユーザー検索のカードからフォロー解除できる", async ({ page, mockApi, enableSearchPage }) => {
    await mockApi()
    await enableSearchPage()

    await page.goto("https://www.nicovideo.jp/user_search/TEST")
    await page.bringToFront()

    const card = page.locator(".search-result-items .useritem-card").first()
    await expect(card).toHaveCount(1)
    await expect(card).toHaveAttribute("data-is-following", "true")
    await expect(card.locator(".useritem-nickname")).toHaveText("TestUser 0")

    const followButton = card.locator(".useritem-followbutton")
    await expect(followButton).toHaveText("フォロー解除")

    await followButton.click()

    const alert = page.locator(".alert-container")
    await expect(alert).toBeVisible()
    await expect(alert).toContainText("TestUser 0 (ID: 0) のフォローを解除します。よろしいですか？")

    const deleteRequest = page.waitForRequest(request => request.url().includes("niconico-users/0.json") && request.method() === "DELETE")
    await alert.getByRole("button", { name: "解除する", exact: true }).click()
    await deleteRequest

    // 検索結果のキャッシュもパッチされ、カードの状態とボタン表示が更新される
    await expect(card).toHaveAttribute("data-is-following", "false")
    await expect(followButton).toHaveText("フォロー")
    await expect(page.locator(".toast-title")).toHaveText("フォローを解除しました")
})
