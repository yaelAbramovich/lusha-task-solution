import { expect, Locator, Page } from "@playwright/test";
import { HelperBasePage } from "./commonPage/helperBasePage";

export enum headerValues {
  Home = "Home",
  Contact = "Contact",
  AboutUs = "About us",
  Cart = "Cart",
  LogOut = "Log out",
  SignUp = "Sign up",
  LogIn = "Log in",
  Welcome = "Welcome",
}

export class SiteHeaderPage extends HelperBasePage {
  readonly headerTabActiveIndication: string = "active";
  readonly headerItemInitial: string = "li[class^='nav-item']";
  readonly welcomeUserLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeUserLabel = this.page.locator("#nameofuser");
  }

  async waitUntilWelcomeLabelIsVisible() {
    await this.waitUntilLocatorIsVisible(15, this.welcomeUserLabel);
  }

  async getWelcomeLabel() {
    return await this.welcomeUserLabel.textContent();
  }

  async getAllHeaderItems() {
    return await this.page.locator(this.headerItemInitial).all();
  }

  async clickOnHeaderTab(expectedTab: string) {
    const expectedHeaderValues = Object.values(headerValues);
    expect(expectedHeaderValues, `tab '${expectedTab}' should be in site headers tab`).toContain(expectedTab);
    const alltabs = await this.getAllHeaderItems();

    for (const tab of alltabs) {
      let tabName = await tab.textContent();
      if (tabName) {
        if (tabName.includes("(current)")) tabName = tabName.replace(" (current)", "");
        tabName = tabName?.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
        if (tabName.toLowerCase().trim() === expectedTab.toLowerCase()) {
          await tab.click();
          console.log(`clicked on tab '${tabName}'`);
          return;
        }
      }
    }
    throw new Error(`Unable to click on the tab '${expectedTab}' as it was not found, can't continue with test`);
  }
}
