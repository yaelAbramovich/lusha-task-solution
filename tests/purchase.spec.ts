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
  test.beforeEach(async ({ pageManager, page }) => {
    await pageManager.credsPageInstance().openBrowserWithUrl(siteUrl);

    await pageManager.siteHeaderPageInstance().clickOnHeaderTab(headerValues.SignUp);
    await pageManager.signUpPageInstance().fillUserDetailsAndPressOnSignUp(username, password);

    await pageManager.siteHeaderPageInstance().clickOnHeaderTab(headerValues.LogIn);
    await pageManager.logInPageInstance().fillUserDetailsAndPressOnLogIn(username, password);
    await pageManager.siteHeaderPageInstance().waitUntilWelcomeLabelIsVisible();
    const expectedWelcomeLabel = `${headerValues.Welcome} ${username}`;
    const actualWelcomeLabel = await pageManager.siteHeaderPageInstance().getWelcomeLabel();
    expect(actualWelcomeLabel, `user ${username} should be logged in successfully`).toBe(expectedWelcomeLabel);
    // const allCookies = await page.context().cookies();
    // sessionToken = getValueFromContextCookies(allCookies, "tokenp_");

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
    test("API test - add item to cart", { tag: ["@apiTest"] }, async () => {
      // const url = process.env.API_BASE_URL;
      const demoblaze = new DemoblazeApi(username, password);
      // const actualToken = await demoblaze.login(username, password);
      // console.log(`actualToken0: ${actualToken}`);

      // console.log(`0`);
      // if (actualToken !== undefined && actualToken !== "") {
      // console.log(`1`)
      await demoblaze.login();
      await demoblaze.addItemToCart(itemName);

      const actualItemsInCart = await demoblaze.getAllItemsInCart();
      console.log(`actualItemsInCart: ${JSON.stringify(actualItemsInCart)}`);
      // const itemId = this.getItemIdfromName(expectedItemName);
      const expectedItemId = await demoblaze.getItemIdfromName(itemName);
      console.log(`expectedItemId: ${expectedItemId}`);
      if (expectedItemId === undefined) throw new Error(`didn't find item in site, can't add it to cart`);
      // expect(cartItems.length).toBe(1);
      expect(actualItemsInCart.length, `cart must have more then one item in cart`).toBeGreaterThan(0);
      expect(actualItemsInCart[0]["prod_id"], `prod is must be ${expectedItemId}`).toBe(expectedItemId);

      const itemInCartDetails = await demoblaze.getItemInCart(expectedItemId)
      expect(itemInCartDetails["title"], `item should have title: ${itemName}`).toBe(itemName);
      expect(itemInCartDetails["price"], `item should have price: ${itemPrice}`).toBe(itemPrice);

      // const expectedItemId = await demoblaze.getItemIdfromName(itemName);
      // } else throw new Error(`no token, can't continue with test. Check login creds`);
      // let actualToken: string = "";
      // const loginUrl = `${apiBaseUrl}/login`;
      // const userPassword = Buffer.from(password).toString("base64");
      // const loginBody = {
      //   username: username,
      //   password: userPassword,
      // };
      // await axios
      //   .post(loginUrl, loginBody, {
      //     headers: {
      //       accept: "*/*",
      //       "content-type": "application/json",
      //       origin: "https://www.demoblaze.com",
      //       referer: "https://www.demoblaze.com/",
      //       "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.35 Safari/537.36",
      //       "accept-encoding": "gzip, deflate, br, zstd",
      //       "accept-language": "en-US",
      //     },
      //   })
      //   .then((response) => {
      //     console.log(`loginResponse data: ${JSON.stringify(response.data)}`);
      //     actualToken = response.data.split(":")[1];
      //     console.log(`actualToken: \n${actualToken}\n`);
      //   })
      //   .catch((error) => console.error(`viewCartResponse error: ${error}`));

      // if (actualToken.length > 0) {
      //   let itemId: number = 0;

      //   const entriesUrl = `${apiBaseUrl}/entries`;
      //   const entriesResponse = await axios.get(entriesUrl);
      //   expect(entriesResponse.status, `post check response should be success`).toBe(200);
      //   const allItems = entriesResponse.data.Items;

      //   for (const item of allItems) {
      //     if (item["title"] === itemName) itemId = item["id"];
      //   }

      //   if (itemId > 0) {
      //     const addToCartBody = { cookie: actualToken, flag: true, id: "c7aa40b3-0cad-04ba-0ffd-6c672e4461d8", prod_id: itemId };
      //     const addToCartUrl = `${apiBaseUrl}/addtocart`;
      //     await axios
      //       .post(addToCartUrl, addToCartBody, {
      //         headers: {
      //           accept: "*/*",
      //           "content-type": "application/json",
      //           origin: "https://www.demoblaze.com",
      //           referer: "https://www.demoblaze.com/",
      //           "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.35 Safari/537.36",
      //           "accept-encoding": "gzip, deflate, br, zstd",
      //           "accept-language": "en-US",
      //         },
      //       })
      //       .then((response) => console.log(`addToCartResponse data: ${JSON.stringify(response.data)}`))
      //       .catch((error) => console.error(`addToCartResponse error: ${error}`));

      //     const viewCarttUrl = `${apiBaseUrl}/viewcart`;
      //     const viewCartBody = { cookie: actualToken, flag: true };
      //     await axios
      //       .post(viewCarttUrl, viewCartBody, {
      //         headers: {
      //           accept: "*/*",
      //           "content-type": "application/json",
      //           origin: "https://www.demoblaze.com",
      //           referer: "https://www.demoblaze.com/",
      //           "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.35 Safari/537.36",
      //           "accept-encoding": "gzip, deflate, br, zstd",
      //           "accept-language": "en-US",
      //         },
      //       })
      //       .then((response) => {
      //         const cartItems = response.data.Items;
      //         expect(cartItems.length).toBe(1);
      //         expect(cartItems[0]["prod_id"]).toBe(itemId);
      //       })
      //       .catch((error) => console.error(`viewCartResponse error: ${error}`));

      //     const viewUrl = `${apiBaseUrl}/view`;
      //     const viewBody = { id: itemId };
      //     console.log(`viewUrl: ${viewUrl}`);
      //     await axios
      //       .post(viewUrl, viewBody, {
      //         headers: {
      //           accept: "*/*",
      //           "content-type": "application/json",
      //           origin: "https://www.demoblaze.com",
      //           referer: "https://www.demoblaze.com/",
      //           "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.35 Safari/537.36",
      //           "accept-encoding": "gzip, deflate, br, zstd",
      //           "accept-language": "en-US",
      //         },
      //       })
      //       .then((response) => {
      //         expect(response.data["title"]).toBe(itemName);
      //         expect(response.data["price"]).toBe(itemPrice);
      //       })
      //       .catch((error) => console.error(`viewCartResponse error: ${error}`));
      //   }
      // }
    });
  });
});
