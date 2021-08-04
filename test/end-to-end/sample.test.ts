// A simple test to verify a visible window is opened with a title
const Application = require("spectron").Application;
const assert = require("assert");
const appPath =
  "/home/moop204/Documents/uni/thesis/migration-2/ElectronCellEditor/out/cellml-editor-linux-x64/cellml-editor";
// const electronPath = require("electron");

const app = new Application({
  // path: "./../../out/cellml-editor-linux-x64/cellml-editor",
  path: appPath,
});

// const verifyWindowIsVisibleWithTitle = async (app) => {
//   await app.start();
//   try {
//     // Check if the window is visible
//     const isVisible = await app.browserWindow.isVisible();
//     // Verify the window is visible
//     assert.strictEqual(isVisible, true);
//     // Get the window's title
//     const title = await app.client.getTitle();
//     // Verify the window's title
//     assert.strictEqual(title, "incorrect");
//   } catch (error) {
//     // Log any failures
//     console.error("Test failed", error.message);
//   }
//   // Stop the application
//   await app.stop();
// };

// verifyWindowIsVisibleWithTitle(myApp);

describe("Basic tests", function () {
  this.timeout(500000);
  beforeEach(async () => {
    await app.start();
  });

  it("Ensure application works", async () => {
    const winCount = await app.client.getWindowCount();
    return assert.equal(winCount, 2);
  });

  afterEach(async () => {
    await app.stop();
    // if (app && app.isRunning()) {
    //   return app.stop();
    // }
  });
});
