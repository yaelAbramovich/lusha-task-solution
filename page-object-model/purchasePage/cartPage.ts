import { Locator, Page } from "@playwright/test";
import { HelperBasePage } from "../commonPage/helperBasePage";
import { ItemDetails } from "../../utils/itemDetails";

export enum CartValues {
  PlaceOrder = "Place Order",
}

export class CartPage extends HelperBasePage {
  readonly totalPrice: Locator;
  readonly tableRow: Locator;

  constructor(page: Page) {
    super(page);
    this.totalPrice = this.page.locator("#totalp");
    this.tableRow = this.page.locator("tr");
  }

  async getAllTableRows() {
    await this.waitUntilLocatorIsVisible(10, this.page.locator("#tbodyid"));
    return await this.tableRow.all();
  }

  async getItemNameAndPrice() {
    const tableRows = (await this.getAllTableRows()).slice(1);

    const itemsNameAndPrice = Promise.all(
      tableRows.map(async (row) => {
        const [_, name, price] = await row.locator("td").allTextContents();
        return new ItemDetails(name, price);
      })
    );
    return itemsNameAndPrice;
  }

  async getTotalPrice() {
    await this.waitUntilLocatorIsVisible(10, this.page.locator("#tbodyid"));
    return await this.totalPrice.textContent();
  }

  async clickOnPlaceOrder() {
    await this.page.getByRole("button", { name: CartValues.PlaceOrder }).click();
    console.log(`clicked on item '${CartValues.PlaceOrder}'`);
  }
}
