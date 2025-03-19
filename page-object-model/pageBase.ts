import { expect, Locator, Page } from "@playwright/test";

export class pageBase {
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

  async getActualUrl() {
    return this.page.url();
  }

  async waitUntilLoadingFinishes(maxAttempts: number) {
    const maxAttemptsOrg = maxAttempts;
    let isLoadingVisisble = await this.loader.isVisible();
    
    while (!isLoadingVisisble && maxAttempts > 0) {
      await this.page.waitForTimeout(1000);
      isLoadingVisisble = await this.loader.isVisible();
      maxAttempts--;
    }

    if (!isLoadingVisisble && maxAttempts === 0) throw new Error(`waited too long for loading, waited ${(maxAttemptsOrg * 1000) / 60000} minutes`);
    console.log(`loading is done after ${maxAttemptsOrg - maxAttempts} seconds`);
  }
}
