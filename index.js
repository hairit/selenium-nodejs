const { until, By, Builder, Browser, Actions } = require("selenium-webdriver");

const scrape = async () => {
  try {
    const driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.get("https://logistics.temu.com/container/auth/login");

    // Login
    const formLocated = until.elementLocated(By.css("form"));
    const form = await driver.wait(formLocated, 10000);

    const email = form.findElement(By.css("input[placeholder=Email]"));
    const password = form.findElement(By.css("input[type=password]"));
    const button = form.findElement(By.css("button[type=submit]"));
    await email.sendKeys("datagather@drivehailify.com");
    await password.sendKeys("Hailify2024!");
    await button.click();

    const logisticsManagementLocated = until.elementLocated(
      By.css('a[data-report-click-text="Logistics Management"]')
    );
    const logisticsManagement = await driver.wait(
      logisticsManagementLocated,
      20000
    );
    await logisticsManagement.click();

    // const listOfBillsLocated = until.elementLocated(
    //   By.css(
    //     'a[data-tracking-id="menu-Logistics Management-Logistics Management-List of bills of lading in transit-List of bills of lading in transit"]'
    //   )
    // );
    const listOfBills = await logisticsManagement.findElement(
      By.css('a[data-report-click-text="List of bills of lading in transit"]')
    );
    console.log(await listOfBills.getText());
    await listOfBills.click();

    // Navigate to page to be scraped
  } catch (error) {
    console.log(error.message);
  } finally {
    //await driver.quit();
  }
};

const xpathTest = async () => {
  try {
    const driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.get("https://ticketcrusader.com/");

    const navigation = driver.findElement(
      By.xpath("//ul[@id='navigation-items']")
    );
    const navigationItems = await navigation.findElements(
      By.xpath('./*[contains(@class, "navigation-item")]')
    );
    navigationItems.forEach((element) => {
      element.getText().then((text) => console.log(text));
    });

    const invisibleItem = await navigation.findElement(
      By.xpath('./*[contains(@class, "sub-nav-right")]')
    );
    console.log(invisibleItem);
  } catch (error) {
    console.log(error);
  } finally {
  }
};

const invisibleElementTest = async () => {
  try {
    const driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.get("https://ticketcrusader.com/");

    const navigation = driver.findElement(
      By.xpath("//ul[@id='navigation-items']")
    );
    const navigationItem = await navigation.findElement(
      By.xpath('./*[contains(@class, "navigation-item")][4]')
    );
    await driver.actions().move({ origin: navigationItem }).perform();
    const invisibleItem = await driver.findElement(
      By.xpath('//*[contains(@class, "sub-nav-right")]')
    );
    await invisibleItem.click();
  } catch (error) {
    console.log(error);
  } finally {
  }
};

//scrape();
//xpathTest();
invisibleElementTest();
