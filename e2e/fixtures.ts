import { test as base, chromium, type BrowserContext } from "@playwright/test"
import path from "path"
import { watchTestData } from "./datas/watch"
import { mylistsTestData } from "./datas/mylists"
import { watchForbiddenTestData } from "./datas/forbiddenWatch"
import { customRankingTestData } from "./datas/customRanking"
import { genreRankingTestData } from "./datas/genreRanking"
import { channelVideoDAnimeLinksTestData } from "./datas/channelVideoDAnimeLinks"
import { ppvForbiddenWatchTestData } from "./datas/ppvForbiddenWatch"
import { admissionForbiddenWatchTestData } from "./datas/admissionForbiddenWatch"
import { keywordSearchTestData } from "./datas/Search/keyword"
import { searchTagTestData } from "./datas/Search/tag"
import { searchMylistTestData } from "./datas/Search/mylist"
import { searchSeriesTestData } from "./datas/Search/series"
import { searchUserTestData } from "./datas/Search/user"

const pathToExtension = path.resolve(".output/chrome-mv3")

type FixtureType = {
    context: BrowserContext
    extensionId: string
    mockApi: () => Promise<void>
    enableSearchPage: () => Promise<void>
    enableRankingPage: () => Promise<void>
}

export const test = base.extend<FixtureType>({
    context: async ({}, use) => { // eslint-disable-line no-empty-pattern
        const context = await chromium.launchPersistentContext("", {
            headless: false,
            args: [
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
            ],
        })
        context.on("page", async (page) => {
            const url = page.url()
            if (url.includes("welcome.html")) {
                await page.close()
            }
        })
        await use(context)
        await context.close()
    },
    extensionId: async ({ context }, use) => {
        let background: { url(): string }
        if (pathToExtension.endsWith("-mv3")) {
            [background] = context.serviceWorkers()
            if (!background) background = await context.waitForEvent("serviceworker")
        } else {
            [background] = context.backgroundPages()
            if (!background)
                background = await context.waitForEvent("backgroundpage")
        }

        const extensionId = background.url().split("/")[2]
        await use(extensionId)
    },
    mockApi: async ({ page }, use) => {
        async function applyMockApi() {
            await page.route("https://**/*", route => route.abort())
            await page.route("http://**/*", route => route.abort())

            await page.route(/^https:\/\/www\.nicovideo\.jp\/(?!.*\?responseType=json).*$/, route => route.fulfill({
                status: 200,
                body: `<!DOCTYPE html><html lang="ja"><head></head><body></body></html>`,
            }))

            // 通常動画, PURELY
            await page.route("https://www.nicovideo.jp/watch/sm0?responseType=json", route => route.fulfill({
                status: 200,
                json: watchTestData,
            }))

            // PPV, 未レンタル
            await page.route("https://www.nicovideo.jp/watch/so1?responseType=json", route => route.fulfill({
                status: 200,
                json: ppvForbiddenWatchTestData,
            }))

            // Admission, 未加入
            await page.route("https://www.nicovideo.jp/watch/so2?responseType=json", route => route.fulfill({
                status: 200,
                json: admissionForbiddenWatchTestData,
            }))

            // 削除動画
            await page.route("https://www.nicovideo.jp/watch/sm1?responseType=json", route => route.fulfill({
                status: 400,
                json: watchForbiddenTestData,
            }))

            await page.route("https://nvapi.nicovideo.jp/v1/users/me/mylists", route => route.fulfill({
                status: 200,
                json: mylistsTestData,
            }))

            await page.route("https://www.nicovideo.jp/ranking/custom?responseType=json", route => route.fulfill({
                status: 200,
                json: customRankingTestData,
            }))

            await page.route(/https:\/\/www\.nicovideo\.jp\/ranking\/genre\?responseType=json&page=.&term=.*/, route => route.fulfill({
                status: 200,
                json: genreRankingTestData,
            }))

            // 検索API - キーワード検索
            await page.route(/https:\/\/www\.nicovideo\.jp\/search\/TEST\?responseType=json.*/, route => route.fulfill({
                status: 200,
                json: keywordSearchTestData,
            }))

            // 検索API - タグ検索
            await page.route(/https:\/\/www\.nicovideo\.jp\/tag\/.*\?responseType=json.*/, route => route.fulfill({
                status: 200,
                json: searchTagTestData,
            }))

            // 検索API - マイリスト検索
            await page.route(/https:\/\/www\.nicovideo\.jp\/mylist_search\/TEST\?responseType=json.*/, route => route.fulfill({
                status: 200,
                json: searchMylistTestData,
            }))

            // 検索API - シリーズ検索
            await page.route(/https:\/\/www\.nicovideo\.jp\/series_search\/TEST\?responseType=json.*/, route => route.fulfill({
                status: 200,
                json: searchSeriesTestData,
            }))

            // 検索API - ユーザー検索
            await page.route(/https:\/\/www\.nicovideo\.jp\/user_search\/TEST\?responseType=json.*/, route => route.fulfill({
                status: 200,
                json: searchUserTestData,
            }))

            // 検索API - 新しいキーワード（テスト用）
            await page.route(/https:\/\/www\.nicovideo\.jp\/search\/.*responseType=json.*/, route => route.fulfill({
                status: 200,
                json: keywordSearchTestData,
            }))

            // ページネーション用 - 2ページ目
            await page.route(/https:\/\/www\.nicovideo\.jp\/search\/.*page=2.*responseType=json.*/, route => route.fulfill({
                status: 200,
                json: keywordSearchTestData,
            }))
            await page.route(/https:\/\/public-api.ch.nicovideo.jp\/v1\/user\/channelVideoDAnimeLinks\?videoId=.*/, route => route.fulfill({
                status: 404,
                json: channelVideoDAnimeLinksTestData,
            }))
        }
        await use(applyMockApi)
    },
    enableSearchPage: async ({ page, extensionId }, use) => {
        async function enableSearchPageFunction() {
            await page.goto(`chrome-extension://${extensionId}/settings.html`)
            await page.getByRole("checkbox", { name: "Experimental: Enable replacement of the search page" }).click()
        }

        await use(enableSearchPageFunction)
    },
    enableRankingPage: async ({ page, extensionId }, use) => {
        async function enableRankingPageFunction() {
            await page.goto(`chrome-extension://${extensionId}/settings.html`)
            await page.getByRole("checkbox", { name: "Experimental: Enable replacement of the ranking page (Re:Shogi)" }).click()
        }
        await use(enableRankingPageFunction)
    },
})
export const expect = test.expect
