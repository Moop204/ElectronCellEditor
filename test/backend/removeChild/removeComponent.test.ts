import { Model } from "../../../src/types/ILibcellml";
import FileManagement from "../../../src/backend/FileManagement";
import assert from "assert";
import { removeComponent } from "../../../src/backend/removeChild/removeComponent";
import { IChild } from "../../../src/types/IProperties";
import { Elements } from "../../../src/types/Elements";
import { removeElement } from "../../../src/backend/removeChild/removeElement";
import { ISelect } from "../../../src/types/IQuery";

describe("Removing CellML Component into property format", function () {
  this.timeout(5000);
  let fm: FileManagement;
  let m: Model;
  beforeEach(async () => {
    fm = new FileManagement();
    await fm.init();

    const processor = fm._processor;
    m = processor.buildModel("testModel");
    const c1 = processor.buildComponent("c1");
    const c2 = processor.buildComponent("c2", "source", "component_ref");

    processor.addComponent(m, c1);
    processor.addComponent(m, c2);

    fm.updateContentFromModel(m);
    fm.setCurrent(m, Elements.model);
  });

  it("Removing local Component", async () => {
    const request: ISelect = {
      element: Elements.component,
      select: {
        index: 0,
        name: "c1",
      },
    };

    removeElement(fm, request);

    const postRemoval = fm.getContent();
    const postModel = fm.parseModel(postRemoval);
    // Check attributes of element are preserved
    assert.strictEqual(
      postModel.componentCount(),
      m.componentCount() - 1,
      "Component count decreases by one"
    );
    // Check children
    assert.strictEqual(
      fm._processor.matchElement(fm.getCurrent(), Elements.model),
      true,
      "Current element remains the same"
    );
  });
  it("Removing imported Component", async () => {
    const child: IChild = {
      name: "c2",
      index: 0,
    };

    removeComponent(fm, child);

    const postRemoval = fm.getContent();
    const postModel = fm.parseModel(postRemoval);
    // Check attributes of element are preserved
    assert.strictEqual(
      postModel.componentCount(),
      m.componentCount() - 1,
      "Component count decreases by one"
    );
    // Check children
    assert.strictEqual(
      fm._processor.matchElement(fm.getCurrent(), Elements.model),
      true,
      "Current element remains the same"
    );
  });
});
