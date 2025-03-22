import { Locator, Page } from "@playwright/test";
import { HelperBasePage } from "../commonPage/helperBasePage";

export enum PlaceOrderValues {
  Purchase = "Purchase",
  PurchaseSuccessMsg = "Thank you for your purchase!",
  Title = "Place order",
  AmountField = "Amount:",
  CardNumField = "Card Number:",
}

export class PlaceOrderPage extends HelperBasePage {
  readonly totalPrice: Locator;
  readonly nameInput: Locator;
  readonly creaditCardInput: Locator;
  readonly sweetAlert: string = "sweet-alert  showSweetAlert visible";
  readonly sweetAlerTitle: Locator;
  readonly sweetAlerDetails: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.totalPrice = this.page.locator("#totalm");
    this.nameInput = this.page.locator("#name");
    this.creaditCardInput = this.page.locator("#card");
    this.sweetAlerTitle = this.page.locator(`div[class='${this.sweetAlert}'] h2`);
    this.sweetAlerDetails = this.page.locator(`div[class='${this.sweetAlert}'] p`);
    this.pageTitle = this.page.locator(`#orderModalLabel`);
  }

  async getPageTitle() {
    return await this.pageTitle.textContent();
  }

  async getSweetAlertTitle() {
    return await this.sweetAlerTitle.textContent();
  }

  async getSweetAlertDetails() {
    return await this.sweetAlerDetails.allTextContents();
  }

  async getPurchaseAmountFromSummary() {
    const allDetails = await this.getSweetAlertDetails();
    const startIndex = allDetails[0].indexOf(PlaceOrderValues.AmountField);
    const endIndex = allDetails[0].indexOf(PlaceOrderValues.CardNumField);
    const extracted = allDetails[0].substring(startIndex, endIndex).trim();
    const actualAmount = extracted.split(":")[1];
    return actualAmount;
  }

  async fillFullName(fullName: string) {
    await this.nameInput.fill(fullName);
  }

  async fillCreditCard(creditCard: string) {
    await this.creaditCardInput.fill(creditCard);
  }

  async clickOnPurchase() {
    await this.page.locator("div[class='modal-footer']").getByText(PlaceOrderValues.Purchase).click();
    console.log(`clicked on 'Purchase' button`);
  }

  async makePurchase(username: string, creditCardDetails: string) {
    await this.fillFullName(username);
    await this.fillCreditCard(creditCardDetails);
    await this.clickOnPurchase();
  }
}
