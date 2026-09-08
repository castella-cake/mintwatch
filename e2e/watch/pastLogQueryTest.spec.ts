import { expect, test } from "../fixtures"
import type { Page } from "@playwright/test"

const pastLogEpoch = Math.floor(Date.now() / 1000) - 86400

function makeCommentData(body: string) {
    const comment = {
        id: "1",
        no: 1,
        vposMs: 1000,
        body,
        commands: [],
        userId: "e2e",
        isPremium: false,
        score: 0,
        postedAt: "2020-01-01T00:00:00+09:00",
        nicoruCount: 0,
        nicoruId: null,
        source: "e2e",
        isMyPost: false,
    }
    const thread = (fork: string) => ({
        id: fork,
        fork,
        commentCount: 1,
        comments: [comment],
    })
    return {
        meta: { status: 200 },
        data: {
            globalComments: [],
            threads: [thread("main"), thread("owner"), thread("easy")],
        },
    }
}

// リクエストボディに when が含まれるかで、過去ログ用と通常用のレスポンスを切り替えるモック
async function mockCommentApi(page: Page, whenRequests: number[]) {
    await page.route("https://public.nvcomment.nicovideo.jp/v1/threads", async (route) => {
        const postData = route.request().postDataJSON() as { additionals?: { when?: unknown } } | null
        const when = postData?.additionals?.when
        if (typeof when === "number") whenRequests.push(when)
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            json: typeof when === "number"
                ? makeCommentData("過去ログのコメント")
                : makeCommentData("通常のコメント"),
        })
    })
}

test("Watch: past_log クエリで confirm 後に過去ログが読み込まれる", async ({ page, mockApi }) => {
    await mockApi()
    const whenRequests: number[] = []
    await mockCommentApi(page, whenRequests)

    await page.goto(`https://www.nicovideo.jp/watch/sm0?past_log=${pastLogEpoch}`)
    await page.bringToFront()

    const alert = page.locator(".alert-container")
    await expect(alert).toBeVisible()
    await expect(alert).toContainText("過去ログを読み込みますか？")
    await expect(alert).toContainText("指定日時")

    await alert.getByRole("button", { name: "読み込む", exact: true }).click()

    const commentBody = page.locator(".commentlist-list-item-body").first()
    await expect(commentBody).toHaveText("過去ログのコメント")
    expect(whenRequests).toEqual([pastLogEpoch])
})

test("Watch: past_log クエリでキャンセルすると読み込まれない", async ({ page, mockApi }) => {
    await mockApi()
    const whenRequests: number[] = []
    await mockCommentApi(page, whenRequests)

    await page.goto(`https://www.nicovideo.jp/watch/sm0?past_log=${pastLogEpoch}`)
    await page.bringToFront()

    const alert = page.locator(".alert-container")
    await expect(alert).toBeVisible()
    await alert.getByRole("button", { name: "キャンセル" }).click()

    await expect(alert).toBeHidden()
    const commentBody = page.locator(".commentlist-list-item-body").first()
    await expect(commentBody).toHaveText("通常のコメント")
    expect(whenRequests).toEqual([])
})

test("Watch: 不正な past_log クエリでは確認が表示されない", async ({ page, mockApi }) => {
    await mockApi()
    const whenRequests: number[] = []
    await mockCommentApi(page, whenRequests)

    await page.goto("https://www.nicovideo.jp/watch/sm0?past_log=abc")
    await page.bringToFront()

    await page.waitForSelector("#pmw-element-video")
    await page.waitForTimeout(2000)
    await expect(page.locator(".alert-container")).toHaveCount(0)
    expect(whenRequests).toEqual([])
})

test("Watch: 自動で読み込み を押すと過去ログが読み込まれる", async ({ page, mockApi }) => {
    await mockApi()
    const whenRequests: number[] = []
    await mockCommentApi(page, whenRequests)

    await page.goto(`https://www.nicovideo.jp/watch/sm0?past_log=${pastLogEpoch}`)
    await page.bringToFront()

    const alert = page.locator(".alert-container")
    await expect(alert).toBeVisible()
    await alert.getByRole("button", { name: "自動で読み込む" }).click()

    const commentBody = page.locator(".commentlist-list-item-body").first()
    await expect(commentBody).toHaveText("過去ログのコメント")
    expect(whenRequests).toEqual([pastLogEpoch])
})

test("Watch: 自動読み込み設定がONのとき past_log クエリで確認なしで読み込まれる", async ({ page, mockApi, enablePastLogAutoLoad }) => {
    await mockApi()
    await enablePastLogAutoLoad()

    const whenRequests: number[] = []
    await mockCommentApi(page, whenRequests)

    await page.goto(`https://www.nicovideo.jp/watch/sm0?past_log=${pastLogEpoch}`)
    await page.bringToFront()

    await page.waitForSelector("#pmw-element-video")
    await page.waitForTimeout(2000)
    await expect(page.locator(".alert-container")).toHaveCount(0)

    const commentBody = page.locator(".commentlist-list-item-body").first()
    await expect(commentBody).toHaveText("過去ログのコメント")
    expect(whenRequests).toEqual([pastLogEpoch])
})
