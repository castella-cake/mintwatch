import { expect, test } from "../fixtures";

test('Ranking: Genre rendering test', async ({ page, context, mockApi, extensionId }) => {
    await mockApi();
    
    await page.goto(`chrome-extension://${extensionId}/settings.html`);

    await page.getByRole('checkbox', { name: 'Experimental: Enable' }).check();

    await page.goto('https://www.nicovideo.jp/ranking/genre');
    await page.bringToFront();

    await page.waitForSelector(".reshogi-container");

    await expect(page.locator('#root-pmw')).toContainText('For testing purposes only');
});