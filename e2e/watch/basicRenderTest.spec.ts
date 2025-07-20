import { expect, test } from "../fixtures";

test('Watch: Basic rendering test', async ({ page, mockApi }) => {
    await mockApi();
    
    await page.goto('https://www.nicovideo.jp/watch/sm0');
    await page.bringToFront();

    await page.waitForSelector("#pmw-element-video");

    await expect(page.locator('.videotitle')).toHaveText("For testing purpose only");
});