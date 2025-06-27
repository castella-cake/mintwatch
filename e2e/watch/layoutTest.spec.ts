import { expect, test } from "../fixtures";

test('Layout change test', async ({ page, context, mockApi }) => {
    await mockApi();
    
    await page.goto('https://www.nicovideo.jp/watch/sm0');
    await page.bringToFront();

    await page.waitForSelector("#pmw-element-video")

    const watchType = ["recresc", "renew", "stacked", "3col", "shinjuku", "rerekari"]
    for (const type of watchType) {
        // open settings
        await page.getByRole('button', { name: 'MintWatch の設定' }).click();
        // set watch type
        await page.getByLabel('Layout of the watch pageRe-').selectOption(type);
    
        // close
        await page.getByRole('heading', { name: 'MintWatch の設定' }).getByRole('button').click();
        // check attribute is correct
        await expect(page.locator('.watch-container')).toHaveAttribute("data-watch-type", type)
    }
});