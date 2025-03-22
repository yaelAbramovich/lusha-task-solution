import { Locator, Page } from "@playwright/test";
import { CredsPage } from "./credsPage";

export enum LoginValues {
  LoginValue = "Log in",
}

export class LogInPage extends CredsPage {
  readonly loginTitle: Locator;
  readonly loginUsernameInput: Locator;
  readonly loginPasswordInput: Locator;

  constructor(page: Page) {
    super(page);
    this.loginTitle = this.page.locator("#logInModalLabel");
    this.loginUsernameInput = this.page.locator("#loginusername");
    this.loginPasswordInput = this.page.locator("#loginpassword");
  }

  async getLoginTitle() {
    return await this.loginTitle.textContent();
  }

  async clickOnLogInButton() {
    await this.page.locator("div[class='modal-footer']").getByText(LoginValues.LoginValue).click();
    console.log(`clicked on '${LoginValues.LoginValue}' button`);
  }

  async fillUserDetailsAndPressOnLogIn(exepectedUsername: string, expectedPassword: string) {
    await this.fillInput(this.loginUsernameInput, exepectedUsername);
    await this.fillInput(this.loginPasswordInput, expectedPassword);
    await this.clickOnLogInButton();
  }
}
