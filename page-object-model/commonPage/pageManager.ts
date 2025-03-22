import { Page } from "@playwright/test";
import { SiteHeaderPage } from "../siteHeaderPage";
import { CredsPage } from "../authenticationPage/credsPage";
import { SignUpPage } from "../authenticationPage/signUpPage";
import { LogInPage } from "../authenticationPage/loginPage";
import { CatalogItemsPage } from "../catalogItemsPage";
import { ItemDetailsPage } from "../itemDetailsPage";
import { CartPage } from "../purchasePage/cartPage";
import { PlaceOrderPage } from "../purchasePage/placeOrderPage";

export class PageManger {
  private readonly page: Page;
  private readonly siteHeaderPage: SiteHeaderPage;
  private readonly credsPage: CredsPage;
  private readonly signUpPage: SignUpPage;
  private readonly logInPage: LogInPage;
  private readonly catalogItemsPage: CatalogItemsPage;
  private readonly itemDetailsPage: ItemDetailsPage;
  private readonly cartPage: CartPage;
  private readonly placeOrderPage: PlaceOrderPage;

  constructor(page: Page) {
    this.page = page;
    this.siteHeaderPage = new SiteHeaderPage(this.page);
    this.credsPage = new CredsPage(this.page);
    this.signUpPage = new SignUpPage(this.page);
    this.logInPage = new LogInPage(this.page);
    this.catalogItemsPage = new CatalogItemsPage(this.page);
    this.itemDetailsPage = new ItemDetailsPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.placeOrderPage = new PlaceOrderPage(this.page);
  }

  placeOrderPageInstance() {
    return this.placeOrderPage;
  }

  cartPageInstance() {
    return this.cartPage;
  }

  itemDetailsPageInstance() {
    return this.itemDetailsPage;
  }

  catalogItemsPageInstance() {
    return this.catalogItemsPage;
  }

  siteHeaderPageInstance() {
    return this.siteHeaderPage;
  }

  credsPageInstance() {
    return this.credsPage;
  }

  signUpPageInstance() {
    return this.signUpPage;
  }

  logInPageInstance() {
    return this.logInPage;
  }
}
