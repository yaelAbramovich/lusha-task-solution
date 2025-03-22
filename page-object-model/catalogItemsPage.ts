import { Locator, Page } from "@playwright/test";
import { HelperBasePage } from "./commonPage/helperBasePage";

export class CatalogItemsPage extends HelperBasePage {
  readonly oneItem: Locator;

  constructor(page: Page) {
    super(page);
    this.oneItem = this.page.locator(".card-block");
  }

  async getAllItems() {
    return await this.oneItem.all();
  }

  async clickOnCategory(categoryName: string) {
    await this.page.getByText(categoryName).click();
    console.log(`clicked on category '${categoryName}'`);
  }

  async getItemEntity(expectedItemName: string) {
    await this.waitUntilLocatorIsVisible(10, this.page.locator("#tbodyid"));

    const allItems = await this.getAllItems();
    for (const item of allItems) {
      const itemTitle = await item.locator(".card-title").textContent();
      if (itemTitle?.toLowerCase().includes(expectedItemName.toLowerCase())) return item;
    }
    throw new Error(`Couldn't find item '${expectedItemName}', can't continue with test`);
  }

  async clickOnItemByName(expectedItemName: string) {
    const expectedEntity = await this.getItemEntity(expectedItemName);
    await expectedEntity.locator("h4 a").click();
    console.log(`clicked on item '${expectedItemName}'`);
  }

  async getItemPrice(expectedItemName: string) {
    const expectedEntity = await this.getItemEntity(expectedItemName);
    return await expectedEntity?.locator("h5").textContent();
  }
}
