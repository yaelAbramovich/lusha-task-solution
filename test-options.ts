import { test as base } from "@playwright/test";
import { PageManger } from "./page-object-model/commonPage/pageManager";

export type TestOptions = {
  pageManager: PageManger;
};

export const test = base.extend<TestOptions>({
  pageManager: async ({ page }, use) => {
    const pm = new PageManger(page);
    await use(pm);
  },
});
