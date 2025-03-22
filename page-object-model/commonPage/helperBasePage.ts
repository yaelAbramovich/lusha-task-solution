import { Locator, Page } from "@playwright/test";

export class HelperBasePage {
  readonly page: Page;
  readonly loader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loader = this.page.getByTestId("loader");
  }

  async openBrowserWithUrl(url: string) {
    await this.page.goto(url);
    console.log(`browser opened with url: ${url}`);
  }

  async waitUntilLocatorIsVisible(maxAttempts: number, expectedLocator: Locator) {
    const maxAttemptsOrg = maxAttempts;
    let isLoadingVisisble = await expectedLocator.isVisible();

    while (!isLoadingVisisble && maxAttempts > 0) {
      await this.page.waitForTimeout(1000);
      isLoadingVisisble = await expectedLocator.isVisible();
      maxAttempts--;
    }

    if (!isLoadingVisisble && maxAttempts === 0) throw new Error(`waited too long for loading, waited ${(maxAttemptsOrg * 1000) / 60000} minutes`);
  }

}
