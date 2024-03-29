const webdriver = require("selenium-webdriver");
const applicationPath =
  "/home/moop204/Documents/uni/thesis/migration-2/ElectronCellEditor/out/cellml-editor-linux-x64/cellml-editor";

const driver = new webdriver.Builder()
  // The "9515" is the port opened by chrome driver.
  .usingServer("http://localhost:9515")
  .withCapabilities({
    "goog:chromeOptions": {
      // Here is the path to your Electron binary.
      binary: applicationPath,
    },
  })
  .forBrowser("chrome") // note: use .forBrowser('electron') for selenium-webdriver <= 3.6.0
  .build();

driver.get("http://www.google.com");
driver.findElement(webdriver.By.name("q")).sendKeys("webdriver");
driver.findElement(webdriver.By.name("btnG")).click();
driver.wait(() => {
  return driver.getTitle().then((title) => {
    return title === "webdriver - Google Search";
  });
}, 1000);

driver.quit();
