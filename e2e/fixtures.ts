import { test as base, chromium, type BrowserContext } from "@playwright/test"
import path from "path"
import { watchTestData } from "./datas/watch"
import { mylistsTestData } from "./datas/mylists"
import { watchForbiddenTestData } from "./datas/forbiddenWatch"
import { customRankingTestData } from "./datas/customRanking"
import { genreRankingTestData } from "./datas/genreRanking"

const pathToExtension = path.resolve(".output/chrome-mv3")

export const test = base.extend<{
    context: BrowserContext
    extensionId: string
    mockApi: () => Promise<void>
}>({
            context: async ({}, use) => { // eslint-disable-line no-empty-pattern
                const context = await chromium.launchPersistentContext("", {
                    headless: false,
                    args: [
                        `--disable-extensions-except=${pathToExtension}`,
                        `--load-extension=${pathToExtension}`,
                    ],
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

                    await page.route("https://www.nicovideo.jp/watch/sm0?responseType=json", route => route.fulfill({
                        status: 200,
                        json: watchTestData,
                    }))

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
                }

                await use(applyMockApi)
            },
        })
export const expect = test.expect
