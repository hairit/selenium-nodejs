const { until, By, Builder, Browser, Actions } = require("selenium-webdriver");

const scrape = async () => {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();
  await driver.get("https://logistics.temu.com/container/auth/login");
  try {
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
    await driver.quit();
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

const scrapeStudentsIwsp = async (name) => {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();
  await driver.get("https://growpro.fxwebapps.com/auth/login");
  try {
    // Find login elements
    const loginFormLocated = until.elementLocated(By.className("form-default"));
    const loginForm = await driver.wait(loginFormLocated, 10000);
    const emailInput = loginForm.findElement(By.id("email"));
    const passwordInput = loginForm.findElement(By.id("password"));
    // Login
    await emailInput.sendKeys("faisalfxmweb+pa1@gmail.com");
    await passwordInput.sendKeys("Password@12345");
    await loginForm.submit();
    // Navigate to users page
    const usersNav = await driver.wait(
      until.elementLocated(By.css('a[href="/portal/user"]')),
      10000
    );
    await usersNav.click();

    if (name && name.trim()) {
      const filterInput = await driver.wait(
        until.elementLocated(By.css("input[type=text]")),
        10000
      );
      await filterInput.sendKeys(name);
      await delay(2000);
    }

    const perPageDropdown = await driver.wait(
      until.elementLocated(By.xpath('//select[contains(@class, "sc-cwSeag")]')),
      10000
    );
    const perPageItem = perPageDropdown.findElement(
      By.xpath("./option[@selected]")
    );
    const perPage = await perPageItem.getText();
    const pagingText = await driver
      .findElement(By.className("sc-bYMpWt sc-kMjNwy KQKvZ hecCuC"))
      .getText();
    const pagingInfo = pagingText
      .split("of")
      .map((t) => t.trim())
      .filter((t) => t);
    const pages = Math.ceil(parseInt(pagingInfo[1]) / perPage);

    let data = [];
    for (let page = 0; page < pages; page++) {
      await delay(2000);

      const rows = await driver.wait(
        until.elementsLocated(By.className("rdt_TableRow")),
        10000
      );
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        data.push({
          name: await row.findElement(By.xpath("./div[2]")).getText(),
          organization: await row.findElement(By.xpath("./div[3]")).getText(),
          programme: await row.findElement(By.xpath("./div[4]")).getText(),
          email: await row.findElement(By.xpath("./div[5]")).getText(),
        });
      }
      const nextBtn = await driver.findElement(By.id("pagination-next-page"));
      await driver.actions().move({ origin: nextBtn }).click().perform();
    }
    console.table(data);
  } catch (error) {
    console.log(error);
  } finally {
    //driver.quit();
  }
};

const delay = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds);
  });
};

//scrape();
//xpathTest();
//invisibleElementTest();
scrapeStudentsIwsp(); // pagination
