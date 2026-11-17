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
import { searchPlaylistTestData } from "./datas/playlist"
import { recommendationsTestData } from "./datas/recommendations"
import { watchLazyTestData } from "./datas/watchLazy"
import { followTargetUserDataTestData, myUserDataTestData } from "./datas/userData"
import { createUserFollowingsTestData, userFolloweeIds } from "./datas/userFollowings"
import { createUserFollowStatusTestData, userFollowSuccessTestData } from "./datas/userFollow"

const pathToExtension = path.resolve(".output/chrome-mv3")

type FixtureType = {
    context: BrowserContext
    extensionId: string
    mockApi: () => Promise<void>
    enableSearchPage: () => Promise<void>
    enableUserPage: () => Promise<void>
    enableRankingPage: () => Promise<void>
    enableRecommendationsPage: () => Promise<void>
    enablePastLogAutoLoad: () => Promise<void>
}

export const test = base.extend<FixtureType>({
    context: async ({}, use) => { // eslint-disable-line no-empty-pattern
        const context = await chromium.launchPersistentContext("", {
            // headless: false,
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
    mockApi: async ({ page, context }, use) => {
        async function applyMockApi() {
            // context.route() を使い、新タブを開いた場合もモックが適用されるようにする
            // (page.route() は該当ページのみで、target="_blank" で開いた新タブには適用されない)
            await context.route("https://**/*", route => route.abort())
            await context.route("http://**/*", route => route.abort())

            await context.route(/^https:\/\/www\.nicovideo\.jp\/(?!.*\?responseType=json).*$/, route => route.fulfill({
                status: 200,
                body: `<!DOCTYPE html><html lang="ja"><head></head><body></body></html>`,
            }))

            // 動画情報のURLはクエリが増えるため、正規表現で前方一致させておく
            // 通常動画, PURELY
            await page.route(/^https:\/\/www\.nicovideo\.jp\/watch\/sm9\?responseType=json/, route => route.fulfill({
                status: 200,
                json: watchTestData,
            }))

            // PPV, 未レンタル
            await page.route(/^https:\/\/www\.nicovideo\.jp\/watch\/so22102776\?responseType=json/, route => route.fulfill({
                status: 200,
                json: ppvForbiddenWatchTestData,
            }))

            // Admission, 未加入
            await page.route(/^https:\/\/www\.nicovideo\.jp\/watch\/so31960146\?responseType=json/, route => route.fulfill({
                status: 200,
                json: admissionForbiddenWatchTestData,
            }))

            // 削除動画
            await page.route(/^https:\/\/www\.nicovideo\.jp\/watch\/sm1\?responseType=json/, route => route.fulfill({
                status: 403,
                json: watchForbiddenTestData,
            }))

            // 動画情報のうち Base 取得後に lazy で取得される部分
            await page.route("https://nvapi.nicovideo.jp/v4/watch/lazy/sm9", route => route.fulfill({
                status: 200,
                json: watchLazyTestData,
            }))

            await page.route("https://nvapi.nicovideo.jp/v1/users/me/mylists", route => route.fulfill({
                status: 200,
                json: mylistsTestData,
            }))

            await page.route("https://www.nicovideo.jp/ranking/custom?responseType=json", route => route.fulfill({
                status: 200,
                json: customRankingTestData,
            }))

            // おすすめページAPI
            await page.route("https://www.nicovideo.jp/recommendations?responseType=json", route => route.fulfill({
                status: 200,
                json: recommendationsTestData,
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

            // 検索プレイリストAPI
            await page.route(/https:\/\/nvapi\.nicovideo\.jp\/v1\/playlist\/search.*/, route => route.fulfill({
                status: 200,
                json: searchPlaylistTestData,
            }))

            // ページネーション用 - 2ページ目
            await page.route(/https:\/\/www\.nicovideo\.jp\/search\/.*page=2.*responseType=json.*/, route => route.fulfill({
                status: 200,
                json: keywordSearchTestData,
            }))

            // ユーザーページ / マイページのユーザーデータ
            await page.route("https://nvapi.nicovideo.jp/v1/users/12345", route => route.fulfill({
                status: 200,
                json: followTargetUserDataTestData,
            }))

            await page.route("https://nvapi.nicovideo.jp/v1/users/me", route => route.fulfill({
                status: 200,
                json: myUserDataTestData,
            }))

            // フォロー状態とフォロー一覧は操作に応じて変化させる必要があるため、ハンドラのクロージャで保持する
            // (contextはテスト毎に再生成されるため、状態のリセットは不要)
            let isFollowingFollowTarget = false
            const followingFolloweeIds = [...userFolloweeIds]

            // フォロー中のユーザー一覧 (フォロー解除したユーザーは再取得時に消える)
            await page.route(/https:\/\/nvapi\.nicovideo\.jp\/v1\/users\/me\/following\/users.*/, route => route.fulfill({
                status: 200,
                json: createUserFollowingsTestData(followingFolloweeIds),
            }))

            // フォロー API (GET: 状態取得 / POST: フォロー / DELETE: フォロー解除)
            await page.route(/https:\/\/user-follow-api\.nicovideo\.jp\/v1\/user\/followees\/niconico-users\/.*/, (route) => {
                const method = route.request().method()
                const targetId = Number.parseInt(route.request().url().match(/niconico-users\/(\d+)\.json/)?.[1] ?? "", 10)

                if (method === "GET") {
                    return route.fulfill({
                        status: 200,
                        json: createUserFollowStatusTestData(isFollowingFollowTarget),
                    })
                }

                if (method === "POST") {
                    if (targetId === 12345) isFollowingFollowTarget = true
                    if (userFolloweeIds.includes(targetId) && !followingFolloweeIds.includes(targetId)) followingFolloweeIds.push(targetId)
                } else if (method === "DELETE") {
                    if (targetId === 12345) isFollowingFollowTarget = false
                    const index = followingFolloweeIds.indexOf(targetId)
                    if (index !== -1) followingFolloweeIds.splice(index, 1)
                }

                return route.fulfill({
                    status: 200,
                    json: userFollowSuccessTestData,
                })
            })

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
    enableUserPage: async ({ page, extensionId }, use) => {
        async function enableUserPageFunction() {
            await page.goto(`chrome-extension://${extensionId}/settings.html`)
            await page.getByRole("checkbox", { name: "Experimental: Enable replacement of the user page" }).click()
        }

        await use(enableUserPageFunction)
    },
    enableRankingPage: async ({ page, extensionId }, use) => {
        async function enableRankingPageFunction() {
            await page.goto(`chrome-extension://${extensionId}/settings.html`)
            await page.getByRole("checkbox", { name: "Experimental: Enable replacement of the ranking page (Re:Shogi)" }).click()
        }

        await use(enableRankingPageFunction)
    },
    enableRecommendationsPage: async ({ page, extensionId }, use) => {
        async function enableRecommendationsPageFunction() {
            await page.goto(`chrome-extension://${extensionId}/settings.html`)
            await page.getByRole("checkbox", { name: "Experimental: Enable replacement of the recommendations page" }).click()
        }

        await use(enableRecommendationsPageFunction)
    },
    enablePastLogAutoLoad: async ({ page, extensionId }, use) => {
        async function enablePastLogAutoLoadFunction() {
            await page.goto(`chrome-extension://${extensionId}/settings.html`)
            await page.locator("details.settings-group summary", { hasText: "Detailed settings" }).click()
            await page.getByRole("checkbox", { name: "Auto-load past log from past_log URL" }).click()
        }

        await use(enablePastLogAutoLoadFunction)
    },
})
export const expect = test.expect
