import { expect } from "@playwright/test";
import { PlaceOrderValues } from "../page-object-model/purchasePage/placeOrderPage";
import { PageManger } from "../page-object-model/commonPage/pageManager";

export async function verifyPurchaseSuccess(pageManager: PageManger, expectedTotalPrice: string) {
  const sweetAlertTitle = await pageManager.placeOrderPageInstance().getSweetAlertTitle();
  expect(sweetAlertTitle, `purchase title should be ${PlaceOrderValues.PurchaseSuccessMsg}`).toBe(PlaceOrderValues.PurchaseSuccessMsg);
  const actualAmount = await pageManager.placeOrderPageInstance().getPurchaseAmountFromSummary();
  expect(actualAmount.trim(), `all items total amount should be ${expectedTotalPrice}`).toBe(expectedTotalPrice);
  console.log(`items purchased successfully`);
}

export async function verifyItemDetails(pageManager: PageManger, expectedItemName: string, expectedItemPrice: string) {
  const actualItemTitle = await pageManager.itemDetailsPageInstance().getitemTitle();
  expect(actualItemTitle, `item name should be '${expectedItemName}'`).toBe(expectedItemName);

  const actualItemPrice = await pageManager.itemDetailsPageInstance().getItemPrice();
  expect(actualItemPrice, `item price should be ${expectedItemPrice}`).toBe(`${expectedItemPrice}`);
}

export async function verifyCartTableItems(pageManager: PageManger, itemNameAndPrice: any[]) {
  const allItemsAndPrice = await pageManager.cartPageInstance().getItemNameAndPrice();
  expect(allItemsAndPrice.length, `should have '${itemNameAndPrice.length}' items in cart`).toBe(itemNameAndPrice.length);
  for (const actualItem of allItemsAndPrice) {
    const expectedItem = itemNameAndPrice.find((item) => item.name === actualItem.name);
    if (expectedItem) expect(actualItem.price, `item '${actualItem.name}' should be ${expectedItem.price}`).toBe(expectedItem.price);
    else throw new Error(`couldn't find item '${actualItem.name}', can't continue with test`);
  }
}