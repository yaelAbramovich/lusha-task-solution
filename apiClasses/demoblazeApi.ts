import axios from "axios";
import dotenv from "dotenv";
import { BaseApi } from "./baseApi";

dotenv.config();

export class DemoblazeApi extends BaseApi {
  userName: string;
  password: string;
  actualToken: string = "";

  constructor(userName: string, password: string) {
    super();
    this.userName = userName;
    this.password = password;
  }

  async login() {
    const loginUrl = `${this.apiBaseUrl}/login`;
    const userPassword = Buffer.from(this.password).toString("base64");
    const loginBody = {
      username: this.userName,
      password: userPassword,
    };

    const loginToken = await axios
      .post(loginUrl, loginBody, {
        headers: this.apiHeaders,
      })
      .then((response) => response.data.split(":")[1].trim())
      .catch((error) => {
        throw new Error(`catched an error in login post api call: ${error}`);
      });

    this.actualToken = loginToken;
  }

  async getAllEntries() {
    const entriesUrl = `${this.apiBaseUrl}/entries`;
    const entriesItems = await axios
      .get(entriesUrl)
      .then(async (response) => response.data.Items)
      .catch((error) => {
        throw new Error(`catched an error get all entries. error: ${error}, entriesUrl: ${entriesUrl}`);
      });
    return entriesItems;
  }

  async getItemIdfromName(itemName: string) {
    let itemId = 0;
    const allItems = await this.getAllEntries();

    for (const item of allItems) if (item["title"] === itemName) itemId = item["id"];
    if (itemId === 0) throw new Error(`couldn't find item in site, can't continue with test`);

    return itemId;
  }

  async addItemToCart(itemName: string) {
    const itemId = await this.getItemIdfromName(itemName);

    if (itemId === undefined) throw new Error(`didn't find item in site, can't add it to cart`);
    if (this.actualToken === "") throw new Error(`no token, must run login() before running add item to cart api post`);

    const addToCartBody = { cookie: this.actualToken, flag: true, id: "c7aa40b3-0cad-04ba-0ffd-6c672e4461d8", prod_id: itemId };
    const addToCartUrl = `${this.apiBaseUrl}/addtocart`;
    await axios
      .post(addToCartUrl, addToCartBody, { headers: this.apiHeaders })
      .then(() => console.log(`item added to cart with api call`))
      .catch((error) => {
        throw new Error(`error in adding item to cart with api, error: ${error}, url: ${addToCartUrl}, body: ${JSON.stringify(addToCartBody)}`);
      });
  }

  async getAllItemsInCart() {
    const viewCarttUrl = `${this.apiBaseUrl}/viewcart`;
    const viewCartBody = { cookie: this.actualToken, flag: true };
    const itemsInCarts = await axios
      .post(viewCarttUrl, viewCartBody, {
        headers: this.apiHeaders,
      })
      .then((response) => response.data.Items)
      .catch((error) => {
        throw new Error(`can't get items from cart. error: ${error}, viewCarttUrl: ${viewCarttUrl}, viewCartBody: ${JSON.stringify(viewCartBody)}`);
      });

    return itemsInCarts;
  }

  async getItemInCart(itemId: number) {
    const viewUrl = `${this.apiBaseUrl}/view`;
    const viewBody = { id: itemId };
    const cartitemDetails = await axios
      .post(viewUrl, viewBody, {
        headers: this.apiHeaders,
      })
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`can't get item from cart. error: ${error} itemId: ${itemId}, api url: ${viewUrl}`);
      });
    return cartitemDetails;
  }
}
