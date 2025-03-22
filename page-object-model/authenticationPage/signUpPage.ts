import { Locator, Page } from "@playwright/test";
import { CredsPage } from "./credsPage";

export enum SignUpValues {
  SignUpValue = "Sign up",
  SignUpSuccessfullMsg = "Sign up successful.",
  UserAlreadyExist = "This user already exist.",
}

export class SignUpPage extends CredsPage {
  readonly signUpTitle: Locator;
  readonly signUpUsernameInput: Locator;
  readonly sinupPasswordInput: Locator;

  constructor(page: Page) {
    super(page);
    this.signUpTitle = this.page.locator("#signInModalLabel");
    this.signUpUsernameInput = this.page.locator("#sign-username");
    this.sinupPasswordInput = this.page.locator("#sign-password");
  }

  async clickOnSignUpButton() {
    this.page.once("dialog", async (dialog) => {
      console.log(`dialog message: ${dialog.message()}`);
      await dialog.accept();
    });
    await this.page.locator("div[class='modal-footer']").getByText(SignUpValues.SignUpValue).click();
  }

  async fillUserDetailsAndPressOnSignUp(exepectedUsername: string, expectedPassword: string) {
    await this.fillInput(this.signUpUsernameInput, exepectedUsername);
    await this.fillInput(this.sinupPasswordInput, expectedPassword);
    await this.clickOnSignUpButton();
    if (await this.isClosebuttonVisbile(SignUpValues.SignUpValue)) await this.clickOnCloseButton(SignUpValues.SignUpValue);
  }
}
