import { expect, test } from "../fixtures"
import type { Locator, Page } from "@playwright/test"

function followingUserCard(page: Page, nickname: string): Locator {
    return page.locator(".user-following-users .useritem-card").filter({
        has: page.locator(".useritem-nickname").filter({ hasText: new RegExp(`^${nickname}$`) }),
    })
}

// フォロー一覧のカードから確認ダイアログ経由で解除する
async function unfollowFromList(page: Page, nickname: string) {
    const card = followingUserCard(page, nickname)
    await card.locator(".useritem-followbutton").click()

    const alert = page.locator(".alert-container")
    await expect(alert).toBeVisible()
    await expect(alert).toContainText(`${nickname}`)

    await alert.getByRole("button", { name: "解除する", exact: true }).click()
    await expect(alert).toBeHidden()
}

test("User: フォロー一覧が表示されグリッド表示に切り替えられる", async ({ page, mockApi, enableUserPage }) => {
    await mockApi()
    await enableUserPage()

    await page.goto("https://www.nicovideo.jp/my/follow")
    await page.bringToFront()

    const followingUsers = page.locator(".user-following-users")
    const cards = followingUsers.locator(".useritem-card")
    await expect(cards).toHaveCount(2)
    await expect(followingUsers.getByText("FollowTarget", { exact: true })).toBeVisible()
    await expect(followingUsers.getByText("SecondFollowTarget", { exact: true })).toBeVisible()
    await expect(followingUsers).toHaveAttribute("data-is-grid-layout", "false")

    // グリッド表示に切り替える
    await page.getByTitle("グリッド表示").click()
    await expect(followingUsers).toHaveAttribute("data-is-grid-layout", "true")
    await expect(cards).toHaveCount(2)
    for (let i = 0; i < 2; i++) {
        await expect(cards.nth(i)).toHaveAttribute("data-layout", "vertical-simple")
    }

    // リスト表示に戻す
    await page.getByTitle("リスト表示").click()
    await expect(followingUsers).toHaveAttribute("data-is-grid-layout", "false")
    await expect(cards.nth(0)).not.toHaveAttribute("data-layout", "vertical-simple")
})

test("User: フォロー一覧からの解除ではカードは消えずグレーアウトする", async ({ page, mockApi, enableUserPage }) => {
    await mockApi()
    await enableUserPage()

    await page.goto("https://www.nicovideo.jp/my/follow")
    await page.bringToFront()

    const targetCard = followingUserCard(page, "FollowTarget")
    const targetButton = targetCard.locator(".useritem-followbutton")
    await expect(targetCard).toHaveCount(1)
    await expect(targetButton).toHaveText("フォロー解除")

    const deleteRequest = page.waitForRequest(request => request.url().includes("niconico-users/11111.json") && request.method() === "DELETE")
    await unfollowFromList(page, "FollowTarget")
    await deleteRequest

    // 一覧のカードは残り、グレーアウトした状態になる
    await expect(page.locator(".user-following-users .useritem-card")).toHaveCount(2)
    await expect(targetCard).toHaveCount(1)
    await expect(targetCard).toHaveAttribute("data-is-following", "false")
    await expect(targetCard).toHaveCSS("opacity", "0.75")
    await expect(targetButton).toHaveText("フォロー")
    await expect(page.locator(".toast-title")).toHaveText("フォローを解除しました")
})

test("User: 解除したユーザーはフォロー一覧の再表示で消える", async ({ page, mockApi, enableUserPage }) => {
    await mockApi()
    await enableUserPage()

    await page.goto("https://www.nicovideo.jp/my/follow")
    await page.bringToFront()

    await expect(followingUserCard(page, "FollowTarget")).toHaveCount(1)
    await unfollowFromList(page, "FollowTarget")
    await expect(followingUserCard(page, "FollowTarget")).toHaveAttribute("data-is-following", "false")

    // マイページを経由して再表示する。refetchOnMount: "always" により再取得され、解除したユーザーは消える
    await page.goto("https://www.nicovideo.jp/my")
    await page.bringToFront()
    await expect(page.locator(".userdata-container")).toBeVisible()
    // 自分のページなのでフォローボタン(とサポートするリンク)は表示されない
    await expect(page.locator(".userdata-action-button")).toHaveCount(0)

    await page.goto("https://www.nicovideo.jp/my/follow")
    await page.bringToFront()

    const cards = page.locator(".user-following-users .useritem-card")
    await expect(cards).toHaveCount(1)
    await expect(followingUserCard(page, "FollowTarget")).toHaveCount(0)
    await expect(followingUserCard(page, "SecondFollowTarget")).toHaveCount(1)
})

test("User: グレーアウトしたカードからフォローし直せる", async ({ page, mockApi, enableUserPage }) => {
    await mockApi()
    await enableUserPage()

    await page.goto("https://www.nicovideo.jp/my/follow")
    await page.bringToFront()

    await unfollowFromList(page, "FollowTarget")

    const targetCard = followingUserCard(page, "FollowTarget")
    const targetButton = targetCard.locator(".useritem-followbutton")
    await expect(targetCard).toHaveAttribute("data-is-following", "false")
    await expect(targetButton).toHaveText("フォロー")

    const postRequest = page.waitForRequest(request => request.url().includes("niconico-users/11111.json") && request.method() === "POST")
    await targetButton.click()
    await postRequest

    await expect(targetCard).toHaveAttribute("data-is-following", "true")
    await expect(targetCard).toHaveCSS("opacity", "1")
    await expect(targetButton).toHaveText("フォロー解除")
})
