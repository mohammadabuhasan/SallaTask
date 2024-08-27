import { Page } from "@playwright/test";

export default class LogInPage {
  constructor(public page: Page) {}

  // Define selectors as class properties
  private emailInput = '#email';
  private passwordInput = '#password';
  private loginButton = '//button[@type="submit"]';

  // Method to fill in the email
  async fillEmail(Email: string) {
    await this.page.locator(this.emailInput).fill(Email);
  }

  // Method to fill in the password
  async fillPassword(Password: string) {
    await this.page.locator(this.passwordInput).fill(Password);
  }

  // Method to click the login button and optionally wait for a URL change or network to be idle
  async clickLogin() {
    // Click the login button and wait for network or URL change
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle' }), // Wait for network to be idle (optional)
      this.page.locator(this.loginButton).click(),
    ]);
  }

  // Method to perform a complete login action
  async login(Email: string, Password: string) {
    await this.fillEmail(Email);
    await this.fillPassword(Password);
    await this.clickLogin();
  }
}

// import { Page } from "@playwright/test";

// export default class LogInPage {
//   constructor(public page: Page) {}

//   async fillEmail(Email: string) {
//     await this.page.locator("#email").fill(Email);
//   }

//   async fillPassword(Password: string) {
//     await this.page.locator("#password").fill(Password);
//   }

//   async clickLogin() {
//     // await Promise.all([
//     //     this.page.waitForURL("networkidle")

//     //    ])

//     await this.page.click("//button[@type='submit']");
//   }
//   //button[@type='submit']
//   //(//span[@id="artworks"])[2]
// }
