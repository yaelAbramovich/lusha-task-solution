import { Locator, Page } from "@playwright/test";
import { HelperBasePage } from "../commonPage/helperBasePage";

export enum CredsValues {
  CloseButton = "Close",
  XButton = "x",
  UserNameLabel = "Username:",
  PasswordLabel = "Password:",
}

export class CredsPage extends HelperBasePage {
  readonly UsernameLabel: Locator;
  readonly passwordLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.UsernameLabel = this.page.getByText(CredsValues.UserNameLabel);
    this.passwordLabel = this.page.getByText(CredsValues.PasswordLabel);
  }

  async fillInput(expectedLocator: Locator, value: string) {
    await expectedLocator.fill(value);
  }

  async isClosebuttonVisbile(labelText: string) {
    return await this.page.getByLabel(labelText).getByText(CredsValues.CloseButton).isVisible();
  }

  async clickOnCloseButton(labelText: string) {
    await this.page.getByLabel(labelText).getByText(CredsValues.CloseButton).click();
    console.log(`clicked on 'close' button on '${labelText} drawer'`);
  }
}
