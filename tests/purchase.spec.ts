import { expect } from "@playwright/test";
import { test } from "../test-options";
import { headerValues } from "../page-object-model/siteHeaderPage";
import { getTotalPrice } from "../utils/generalUtils";
import { verifyCartTableItems, verifyItemDetails, verifyPurchaseSuccess } from "../verifications/varifications";
import { PlaceOrderValues } from "../page-object-model/purchasePage/placeOrderPage";
import dotenv from "dotenv";
import { DemoblazeApi } from "../apiClasses/demoblazeApi";

dotenv.config();

const username = process.env.USERNAME ?? "fillInUser";
const password = process.env.PASSWORD ?? "fillInPassword";
const siteUrl = process.env.SITE_URL ?? "https://www.demoblaze.com/";

test.describe("Purchase items from store", { tag: ["@purchaseItems"] }, () => {
  test.beforeEach(async ({ pageManager }) => {
    await pageManager.credsPageInstance().openBrowserWithUrl(siteUrl);

    await pageManager.siteHeaderPageInstance().clickOnHeaderTab(headerValues.SignUp);
    await pageManager.signUpPageInstance().fillUserDetailsAndPressOnSignUp(username, password);

    await pageManager.siteHeaderPageInstance().clickOnHeaderTab(headerValues.LogIn);
    await pageManager.logInPageInstance().fillUserDetailsAndPressOnLogIn(username, password);
    await pageManager.siteHeaderPageInstance().waitUntilWelcomeLabelIsVisible();
    const expectedWelcomeLabel = `${headerValues.Welcome} ${username}`;
    const actualWelcomeLabel = await pageManager.siteHeaderPageInstance().getWelcomeLabel();
    expect(actualWelcomeLabel, `user ${username} should be logged in successfully`).toBe(expectedWelcomeLabel);
    
    console.log(`user ${username} logged in, tests can start running`);
  });

  [
    {
      itemNameAndPrice: [
        { name: "Nexus 6", price: 650, type: "Phones" },
        { name: "MacBook Pro", price: 1100, type: "Laptops" },
      ],
      currency: "USD",
    },
  ].forEach(({ itemNameAndPrice, currency }) => {
    test(`add several items to cart, verify purchase is accurate and success`, { tag: ["@uiTest"] }, async ({ pageManager, page }) => {
      const expectedTotalPrice = `${getTotalPrice(itemNameAndPrice)} ${currency}`;

      page.on("dialog", async (dialog) => {
        console.log(`dialog message: ${dialog.message()}`);
        await dialog.accept();
      });

      for (const item of itemNameAndPrice) {
        const expectedItemName = item.name;
        let expectedItemPrice: number = item.price;

        await pageManager.siteHeaderPageInstance().clickOnHeaderTab(headerValues.Home);
        await pageManager.catalogItemsPageInstance().clickOnCategory(item.type);

        const actualPrice = await pageManager.catalogItemsPageInstance().getItemPrice(expectedItemName);
        expect(actualPrice, `item price should be '${expectedItemPrice}'`).toBe(`$${expectedItemPrice}`);

        await pageManager.catalogItemsPageInstance().clickOnItemByName(expectedItemName);
        await verifyItemDetails(pageManager, expectedItemName, `$${expectedItemPrice}`);

        await pageManager.itemDetailsPageInstance().clickOnAddToCart();
        await page.waitForTimeout(1000);
      }

      await pageManager.siteHeaderPageInstance().clickOnHeaderTab(headerValues.Cart);

      const actualTotalPrice = await pageManager.cartPageInstance().getTotalPrice();
      expect(actualTotalPrice, `total price should be '${expectedTotalPrice}'`).toBe(expectedTotalPrice.toString().replace(` ${currency}`, ""));
      await verifyCartTableItems(pageManager, itemNameAndPrice);

      await pageManager.cartPageInstance().clickOnPlaceOrder();
      const actualPageTitle = await pageManager.placeOrderPageInstance().getPageTitle();
      expect(actualPageTitle, `purchase window title should be '${PlaceOrderValues.Title}'`).toBe(PlaceOrderValues.Title);

      await pageManager.placeOrderPageInstance().makePurchase(username, "000-000-000");
      await verifyPurchaseSuccess(pageManager, expectedTotalPrice);
    });
  });

  [{ itemName: "Nexus 6", itemPrice: 650.0 }].forEach(({ itemName, itemPrice }) => {
    test("API test - add item to cart and verify it added successfully", { tag: ["@apiTest"] }, async () => {
      const demoblaze = new DemoblazeApi(username, password);
      
      await demoblaze.login();
      await demoblaze.addItemToCart(itemName);

      const actualItemsInCart = await demoblaze.getAllItemsInCart();
      expect(actualItemsInCart.length).toBe(1);
      expect(actualItemsInCart.length, `cart must have more then one item in cart`).toBeGreaterThan(0);
      expect(actualItemsInCart[0]["prod_id"], `prod is must be ${actualItemsInCart[0]["prod_id"]}`).toBe(actualItemsInCart[0]["prod_id"]);
      console.log(`item '${itemName}' added to cart successfully`)

      const itemInCartDetails = await demoblaze.getItemInCart(actualItemsInCart[0]["prod_id"]);
      expect(itemInCartDetails["title"], `item should have title: ${itemName}`).toBe(itemName);
      expect(itemInCartDetails["price"], `item should have price: ${itemPrice}`).toBe(itemPrice);
      console.log(`item '${itemName}' name and price are correct`);
    });
  });
});
