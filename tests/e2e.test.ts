import { Page } from "@playwright/test";
import { test, expect } from "@playwright/test";
import LogInPage from "../pages/loginpage";
import ArtWorks from "../pages/Artworks";

test.use({ viewport: { width: 1920, height: 980 } });

test("User should be able to log in", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/login`);
  const loginPage = new LogInPage(page);
  await loginPage.login("jamiwa8396@tospage.com", "nhk9dad2EQW!xae_bpm");

  // Add assertions or further actions after login here
});

test("loginToReviewArtworks", async ({ page, baseURL }) => {
  const login = new LogInPage(page);
  const artworks = new ArtWorks(page);
  const stylesToSelect = ["Abstract", "Cubism", "Minimalism"];
  await page.goto(`${baseURL}/login`);
  await login.fillEmail("jamiwa8396@tospage.com");
  await login.fillPassword("nhk9dad2EQW!xae_bpm");
  await login.clickLogin();
  await artworks.clickArtworks();
  await artworks.clickaddArtworks();
  await artworks.fillArtWorkName("MoeisTesting");
  await artworks.selectEditions("1/1 Edition");
  await artworks.fillDescription("dfsdfsdfsdggdfhghgfddasfadasfsdgfdggdf");
  await artworks.fillCurrentPrice("10");
  await artworks.selectCurrency("MATIC ( Polygon )", 0);
  await artworks.fillPriceAtPrimarySale("15");
  await artworks.selectCurrency("ARB ( Arbitrum )", 1);
  await artworks.selectDate("15", "October", "2024",1);
  await artworks.fillPrimarySaleBuyer("Moeistestingeverything@gmail.com");
  await artworks.uploadArtwork("fixtures/pic.png");
  await artworks.selectStyleOfArtwork(stylesToSelect);
  await artworks.selectNFTGenesis("2018");
  await artworks.selectSupply("25 - 49 /year");
  await artworks.fillCollaborator("moe@sss.com");
  await artworks.fillOwnedBy("test@test.com");
  await artworks.selectTheMarketplaceMintedOn("OpenSea")
  await artworks.fillURL("https://staging.alt.art/artworks/create")
  await artworks.selectDate("20", "November", "2024",2);
  await artworks.selectDate("25", "December", "2024",3);
  await artworks.selectCopyright("COPY RIGHT 1 Lorem ipsum")
  await artworks.selectArtistRoyalty("No")
  await artworks.IsTherePhysicalpPiece("Yes")
  await artworks.artworkPublish( )
});

