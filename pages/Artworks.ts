import { expect, Page } from "@playwright/test";

export default class ArtWorks {
  constructor(public page: Page) {}

  /**
   * Clicks on the "Artworks" button.
   */
  async clickArtworks() {
    await this.page.click('(//span[@id="artworks"])[2]');
  }

  /**
   * Clicks on the "Add Artworks" link to navigate to the artwork creation page.
   */
  async clickaddArtworks() {
    await this.page.click('a[href="/artworks/create"]');
  }

  /**
   * Fills the artwork name field with the specified name.
   * @param ArtWorkName - The name of the artwork to be entered.
   */
  async fillArtWorkName(ArtWorkName: string) {
    await this.page.locator('input[id="artwork_name"]').fill(ArtWorkName);
  }

  /**
   * Selects the specified edition type from the dropdown.
   * @param Editions - The edition type to select.
   */
  async selectEditions(Editions: string) {
    await this.page.getByText("Select Edition Type").click();
    await this.page.getByRole("option", { name: Editions }).click();
  }

  /**
   * Fills the description field with the specified text.
   * @param Despriptions - The description text to be entered.
   */
  async fillDescription(Despriptions: string) {
    await this.page
      .locator('div[data-placeholder="Text here..."]')
      .fill(Despriptions);
  }

  /**
   * Fills the current price field with the specified price and verifies the value.
   * @param Price - The price to be entered.
   */
  async fillCurrentPrice(Price: string) {
    await this.page.locator("#current_price").fill(Price);
    await this.page.locator("#current_price").click();
    await this.page.locator('(//button[@type="button"])[6]').click();
    await this.page.locator('(//button[@type="button"])[7]').click();
    expect(this.page.locator('input[id="current_price"]')).toHaveValue(Price);
  }

  /**
   * Selects the specified currency from a dropdown at the given index.
   * @param Currency - The currency to select.
   * @param Index - The index of the currency dropdown.
   */
  async selectCurrency(Currency: string, Index: number) {
    await this.page.locator(".wallet-input").nth(Index).click();
    await this.page.getByRole("option", { name: Currency }).click();
  }

  /**
   * Extracts text from a paragraph based on a specified pattern and index.
   * @param paragraph - The text paragraph to extract from.
   * @param pattern - The pattern to split the paragraph.
   * @param index - The index of the part to return.
   * @returns The extracted text or null if not found.
   */
  extractTextByPattern(
    paragraph: string,
    pattern: string,
    index: number
  ): string | null {
    const parts = paragraph.split(pattern);
    const trimmedParts = parts
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
    return trimmedParts[index] || null;
  }

  /**
   * Fills the primary sale price field with the specified price and verifies the value.
   * @param Price - The primary sale price to be entered.
   */
  async fillPriceAtPrimarySale(Price: string) {
    await this.page.locator("#primary_sale_price").fill(Price);
    await this.page.locator("#primary_sale_price").click();
    await this.page.locator('(//button[@type="button"])[8]').click();
    await this.page.locator('(//button[@type="button"])[9]').click();
    expect(this.page.locator("#primary_sale_price")).toHaveValue(Price);
  }

  /**
   * Selects a specific date from a date picker.
   * @param Day - The day of the date to select.
   * @param Month - The month of the date to select.
   * @param Year - The year of the date to select.
   * @param indexss - The index of the date picker button.
   */
  async selectDate(Day: any, Month: any, Year: any, indexss: number) {
    await this.page.click(`(//button[@data-state="closed"])[${indexss}]`);
    const targetYear = Year;
    const targetMonth = Month;
    const targetDay = Day;
    let currentMonthYear = await this.page
      .locator('div[data-state="open"] div[aria-live="polite"]')
      .textContent();

    if (currentMonthYear === null) {
      throw new Error(
        "Could not retrieve the current month and year from the date picker."
      );
    }

    let currentYear = this.extractTextByPattern(currentMonthYear, " ", 1);
    let currentMonth = this.extractTextByPattern(currentMonthYear, " ", 0);

    while (
      currentYear !== targetYear.toString() ||
      currentMonth !== targetMonth
    ) {
      if (currentYear === null) {
        throw new Error("currentYear is null and cannot be parsed.");
      }
      if (currentMonth === null) {
        throw new Error("currentMonth is null and cannot be used.");
      }

      const year = parseInt(currentYear);

      if (isNaN(year)) {
        throw new Error("Failed to parse currentYear as a number.");
      }

      if (
        year > targetYear ||
        (year === targetYear && currentMonth > targetMonth)
      ) {
        await this.page.click('button[name="previous-month"]');
      } else {
        await this.page.click('button[name="next-month"]');
      }

      currentMonthYear = await this.page
        .locator('div[data-state="open"] div[aria-live="polite"]')
        .textContent();

      if (currentMonthYear === null) {
        throw new Error(
          "Could not retrieve the current month and year from the date picker."
        );
      }

      currentYear = this.extractTextByPattern(currentMonthYear, " ", 1);
      currentMonth = this.extractTextByPattern(currentMonthYear, " ", 0);

      if (currentYear === null || currentMonth === null) {
        throw new Error(
          "Failed to extract month or year from the date picker."
        );
      }
    }

    const dayButton = await this.page
      .locator(`button[name="day"]:has-text('${Day}')`)
      .click();
    await this.page.mouse.click(0, 0);
    let monthAbbr = Month.slice(0, 3);
    const selectedDate = await this.page
      .locator(`(//button[@data-state="closed"])[${indexss}]/div/span`)
      .textContent();
    console.log(selectedDate);
    expect(selectedDate).toEqual(`${monthAbbr} ${Day}, ${Year}`);
  }

  /**
   * Fills the primary sale buyer field with the specified user and verifies the value.
   * @param User - The username or email address of the buyer.
   */
  async fillPrimarySaleBuyer(User: string) {
    await this.page
      .locator('(//input[@placeholder="Username or Email address"])[1]')
      .fill(User);
    expect(
      this.page.locator(
        '(//input[@placeholder="Username or Email address"])[1]'
      )
    ).toHaveValue(User);
  }

  /**
   * Uploads an artwork file from the specified file path.
   * @param filePath - The path to the artwork file.
   */
  async uploadArtwork(filePath: any) {
    const fileInput = await this.page.locator(
      'input[accept="image/png,image/jpg,image/jpeg,image/gif,video/mp4,video/mov"]'
    );
    await fileInput.setInputFiles(filePath);
  }

  /**
   * Selects and reselects a list of artwork styles, verifying the styles are correctly selected.
   * @param Styles - An array of artwork styles to select.
   */
  async selectStyleOfArtwork(Styles: string[]) {
    await this.page
      .locator("form div")
      .filter({ hasText: "Select Style" })
      .nth(1)
      .click({ force: true });
    for (const style of Styles) {
      await this.page
        .locator('input[id="react-select-4-input"]')
        .click({ force: true, timeout: 5000 });
      await this.page
        .getByRole("option", { name: style })
        .click({ force: true });
      await expect(
        this.page.locator(`//div[contains(text(),'${style}')]`)
      ).toHaveText(style);

      await this.page
        .locator(`div[aria-label="Remove ${style}"]`)
        .click({ force: true });

      await expect(
        this.page.locator(`//div[contains(text(),'${style}')]`)
      ).toBeHidden();

      await this.page
        .locator('input[id="react-select-4-input"]')
        .click({ force: true });
      await this.page
        .getByRole("option", { name: style })
        .click({ force: true });

      await expect(
        this.page.locator(`//div[contains(text(),'${style}')]`)
      ).toHaveText(style);

      await this.page
        .locator(
          'svg[xmlns="http://www.w3.org/2000/svg"] path[d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"]'
        )
        .click();
      await this.page
        .locator("form div")
        .filter({ hasText: "Select Style" })
        .nth(1)
        .click({ force: true });
      await this.page
        .locator('input[id="react-select-4-input"]')
        .click({ force: true });
      await this.page
        .getByRole("option", { name: style })
        .click({ force: true });

      await expect(
        this.page.locator(`//div[contains(text(),'${style}')]`)
      ).toHaveText(style);
    }
  }

  /**
   * Selects the specified NFT Genesis option from a dropdown.
   * @param NFTGenesis - The NFT Genesis option to select.
   */
  async selectNFTGenesis(NFTGenesis: string) {
    await this.page
      .locator("form div")
      .filter({ hasText: "Select NFT Genesis" })
      .nth(2)
      .click();
    await this.page.getByRole("option", { name: NFTGenesis }).click();
    await expect(
      this.page.locator("form div").filter({ hasText: NFTGenesis }).nth(2)
    ).toHaveText(NFTGenesis);
  }

  /**
   * Selects the specified supply option from a dropdown.
   * @param Supply - The supply option to select.
   */
  async selectSupply(Supply: string) {
    await this.page.locator("#react-select-6-input").click({ force: true });
    await this.page.getByRole("option", { name: Supply }).click();
    await expect(
      this.page.locator("form div").filter({ hasText: Supply }).nth(3)
    ).toHaveText(Supply);
  }

  /**
   * Fills the collaborator field with the specified collaborator and verifies the value.
   * @param Collaborator - The name of the collaborator.
   */
  async fillCollaborator(Collaborator: string) {
    await this.page
      .locator('input[id="react-select-7-input"]')
      .fill(Collaborator);
    await this.page.getByRole("option", { name: Collaborator }).click();
    await expect(
      this.page.locator(`//div[contains(text(),'${Collaborator}')]`)
    ).toHaveText(Collaborator);
  }

  /**
   * Fills the "Owned By" field with the specified owner and verifies the value.
   * @param OwnedBy - The username or email address of the owner.
   */
  async fillOwnedBy(OwnedBy: string) {
    await this.page
      .locator('(//input[@placeholder="Username or Email address"])[2]')
      .fill(OwnedBy);
    expect(
      this.page.locator(
        '(//input[@placeholder="Username or Email address"])[2]'
      )
    ).toHaveValue(OwnedBy);
  }

  /**
   * Selects the specified marketplace from a dropdown.
   * @param Marketplace - The marketplace to select.
   */
  async selectTheMarketplaceMintedOn(Marketplace: string) {
    await this.page.getByRole("button", { name: "Select Marketplace" }).click();
    await this.page.getByRole("option", { name: Marketplace }).click();
    await expect(
      this.page.getByRole("button", { name: Marketplace })
    ).toHaveText(Marketplace);
  }

  /**
   * Fills the URL field with the specified URL and verifies the value.
   * @param UrL - The URL to be entered.
   */
  async fillURL(UrL: string) {
    await this.page.locator('input[id="url"]').fill(UrL);
    await expect(this.page.locator('input[id="url"]')).toHaveValue(UrL);
  }

  /**
   * Selects the specified copyright option from a dropdown.
   * @param Copyright - The copyright option to select.
   */
  async selectCopyright(Copyright: string) {
    await this.page.getByRole("button", { name: "Select copyright" }).click();
    await this.page.getByRole("option", { name: Copyright }).click();
  }

  /**
   * Selects the specified artist royalty option and verifies it's checked.
   * @param selection - The artist royalty option to select.
   */
  async selectArtistRoyalty(selection: string) {
    await this.page.getByLabel(selection).first().click();
    await expect(this.page.getByLabel(selection).first()).toBeChecked();
  }

  /**
   * Selects whether there is a physical piece available based on the given option and verifies it's checked.
   * @param options - The option to select (e.g., "Yes" or "No").
   */
  async IsTherePhysicalpPiece(options: string) {
    await this.page.getByLabel(options).nth(1).click();
    await expect(this.page.getByLabel(options).nth(1)).toBeChecked();
  }

  /**
   * Clicks the "Publish" button to publish the artwork.
   */
  async artworkPublish() {
    await this.page.getByRole("button", { name: "Publish" }).click();
  }
}
