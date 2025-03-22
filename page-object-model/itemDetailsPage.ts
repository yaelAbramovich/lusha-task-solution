import { Locator, Page } from "@playwright/test";
import { HelperBasePage } from "./commonPage/helperBasePage";

export enum ItemDetailsValues {
  AddtoCartButtoon = "Add to cart",
  AddedToCartSuccessfully = "Product added.",
  IncluseTaxSymbol = "*",
}

export class ItemDetailsPage extends HelperBasePage {
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartButton = this.page.getByText(ItemDetailsValues.AddtoCartButtoon);
    this.itemName = this.page.locator("h2[class='name']");
    this.itemPrice = this.page.locator("h3[class='price-container']");
  }

  async getitemTitle() {
    return await this.itemName.textContent();
  }

  async getItemPrice() {
    let actualPrice = await this.itemPrice.textContent();
    if (actualPrice?.includes(ItemDetailsValues.IncluseTaxSymbol)) actualPrice = actualPrice.split(ItemDetailsValues.IncluseTaxSymbol)[0].trim();

    return actualPrice;
  }

  async clickOnAddToCart() {
    await this.addToCartButton.click();
    console.log(`clicked on '${ItemDetailsValues.AddtoCartButtoon}' button`);
  }
}
