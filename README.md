# Demoblaze Testing Project

## 📌 Description

The project navigates to the Demoblaze site and attempts to sign up a user. If the user is already registered, an appropriate message will be displayed. Otherwise, the user will be signed up automatically. After signing up, the user logs in, adds items to the cart, verifies that all expected items are displayed, checks the total count, completes a purchase, and confirms the purchase was successful.

## 🛠️ Technologies Used

- Type Script
- Playwright
- Playwright HTML report

## 📦 Installation

1. Clone the repository: `git clone https://github.com/yourusername/project-name.git`
2. run: `npm install`
3. To run project with .env file, install dotenv: `npm install dotenv`
4. To run api tests, install axios: `npm install axios`
5. Playwright doc: https://playwright.dev/docs/intro

## 🎭 How to Run Playwright Test and Report
1. Open Terminal and cd to folder 'demoblaze-testing-project'
2. Run the command `npx playwright test --workers=1` or `npx playwright test --grep @purchaseItems --workers=1` to run all tests
3. Run `npx playwright test --grep @uiTest` to run only UI test
4. Run `npx playwright test --grep @apiTest` to run only API test
5. If test will finish with errors > Playwright HTML report will open with screenshot, video, traces and console log
6. If test will finish successfully and you want to view Playwright HTML report, use command in terminal: `npx playwright show-report`

## 🐛 Issues & Contributions

1. I had to wait 1 second after adding an item to the cart due to the site's slowness. I typically avoid using implicit wait. If I had more time, I would have found the proper solution for this issue.
2. For testing new user sign up: change username and password.
3. For testing signed up user: You can use username: dummy1001, password: 12345

## 👤 Author

Name: Yael Abramovich Kenig
