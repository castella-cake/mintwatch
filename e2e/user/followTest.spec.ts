import { expect, test } from "../fixtures"
import type { Page } from "@playwright/test"

// 初回起動時はヘッダー下に更新情報ポップアップが表示され、ユーザーページのフォローボタンに重なるため閉じる
async function dismissWhatsNew(page: Page) {
    await page.locator(".whatsnew-gotit").first().click()
}

test("User: ユーザーページでフォローできる", async ({ page, mockApi, enableUserPage }) => {
    await mockApi()
    await enableUserPage()

    await page.goto("https://www.nicovideo.jp/user/12345")
    await page.bringToFront()
    await dismissWhatsNew(page)

    const followButton = page.locator(".userdata-action-button[data-action-type='follow']")
    await expect(followButton).toHaveText("フォローする")
    await expect(followButton).toHaveAttribute("data-is-active", "false")

    const postRequest = page.waitForRequest(request => request.url().includes("user-follow-api") && request.method() === "POST")
    await followButton.click()
    await postRequest

    await expect(followButton).toHaveText("フォロー中")
    await expect(followButton).toHaveAttribute("data-is-active", "true")
})

test("User: フォロー解除のconfirmをキャンセルすると解除されない", async ({ page, mockApi, enableUserPage }) => {
    await mockApi()
    await enableUserPage()

    // キャンセル時にDELETEが飛ばないことを確認するための記録
    const deleteRequests: string[] = []
    page.on("request", (request) => {
        if (request.method() === "DELETE" && request.url().includes("user-follow-api")) deleteRequests.push(request.url())
    })

    await page.goto("https://www.nicovideo.jp/user/12345")
    await page.bringToFront()
    await dismissWhatsNew(page)

    const followButton = page.locator(".userdata-action-button[data-action-type='follow']")

    // 先にフォローしておく
    await followButton.click()
    await expect(followButton).toHaveText("フォロー中")

    await followButton.click()

    const alert = page.locator(".alert-container")
    await expect(alert).toBeVisible()
    await expect(alert).toContainText("TestFollowTarget (ID: 12345) のフォローを解除します。よろしいですか？")

    await alert.getByRole("button", { name: "キャンセル", exact: true }).click()
    await expect(alert).toBeHidden()

    // 解除されていない
    await expect(followButton).toHaveText("フォロー中")
    await expect(followButton).toHaveAttribute("data-is-active", "true")
    expect(deleteRequests).toEqual([])
})

test("User: confirmで解除するとフォローが解除される", async ({ page, mockApi, enableUserPage }) => {
    await mockApi()
    await enableUserPage()

    await page.goto("https://www.nicovideo.jp/user/12345")
    await page.bringToFront()
    await dismissWhatsNew(page)

    const followButton = page.locator(".userdata-action-button[data-action-type='follow']")

    // 先にフォローしておく
    await followButton.click()
    await expect(followButton).toHaveText("フォロー中")

    await followButton.click()

    const alert = page.locator(".alert-container")
    await expect(alert).toBeVisible()

    const deleteRequest = page.waitForRequest(request => request.url().includes("user-follow-api") && request.method() === "DELETE")
    await alert.getByRole("button", { name: "解除する", exact: true }).click()
    await deleteRequest

    await expect(followButton).toHaveText("フォローする")
    await expect(followButton).toHaveAttribute("data-is-active", "false")
    await expect(page.locator(".toast-title")).toHaveText("フォローを解除しました")
})
