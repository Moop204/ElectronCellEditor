import assert from "assert";
import { splitMath } from "../../src/frontend/sidebar/math/splitMath";
import { removeCellMl } from "../../src/frontend/sidebar/math/removeCellMl";
import { IXmlElement, IXmlJs } from "../../src/backend/compressCellml";
import xml from "xml-js";

describe("Dividing multiple top-level apply into separate MathML", function () {
  this.timeout(5000);
  it("Converting single apply", async () => {
    const mathMl = `    <math xmlns="http://www.w3.org/1998/Math/MathML"> 
    <apply><eq/> 
      <apply><diff/>
        <bvar><ci>t</ci></bvar>
        <ci>N</ci>
      </apply>
      <apply><divide/>
        <apply><times/>
          <ci>r</ci>
          <ci>N</ci>
          <apply><minus/> 
            <ci>K</ci>
            <ci>N</ci>
          </apply> 
        </apply>
        <bvar><ci>K</ci></bvar>
      </apply>        
    </apply>
  </math>
`;
    const res = splitMath(mathMl);
    assert.strictEqual(res.length, 1);
    console.log(res[0]);
    assert.ok(
      res[0].match(
        /\<math xmlns\=\"http\:\/\/www\.w3\.org\/1998\/Math\/MathML\"\>/g
      )
    );
  });
  it("Converting multiple apply", async () => {
    const mathMl = `    <math xmlns="http://www.w3.org/1998/Math/MathML">
    <apply><eq/> 
      <apply><diff/>
        <bvar><ci>t</ci></bvar>
        <ci>x</ci>
      </apply>
      <ci>y</ci>
    </apply>
    <apply><eq/> 
      <apply><diff/>
        <bvar><ci>t</ci></bvar>
        <ci>y</ci>
      </apply>
      <apply><minus/>
        <apply><times/>
          <ci>u</ci>
          <apply><minus/>
            <cn cellml:units="ms_squared">1</cn> 
            <apply><power/> 
              <ci>x</ci>
              <cn cellml:units="dimensionless">2</cn>
            </apply>
          </apply> 
          <ci>y</ci>
        </apply> 
        <ci>x</ci>
      </apply> 
    </apply>
  </math>
`;
    const res = splitMath(mathMl);
    assert.strictEqual(res.length, 2);
    console.log(res[0]);
    assert.ok(
      res[0].match(
        /\<math xmlns\=\"http\:\/\/www\.w3\.org\/1998\/Math\/MathML\"\>/g
      )
    );
    assert.ok(
      res[1].match(
        /\<math xmlns\=\"http\:\/\/www\.w3\.org\/1998\/Math\/MathML\"\>/g
      )
    );
  });
});

describe("Remove references to CellML in MathML", function () {
  this.timeout(5000);
  it("Converting without cellml references", async () => {
    const mathml = `<apply><eq/> 
    <apply><diff/>
      <bvar><ci>t</ci></bvar>
      <ci>y</ci>
    </apply>
    <apply><minus/>
      <apply><times/>
        <ci>u</ci>
        <apply><minus/>
          <ci >h</ci> 
          <apply><power/> 
            <ci>x</ci>
            <ci >h</ci> 
          </apply>
        </apply> 
        <ci>y</ci>
      </apply> 
      <ci>x</ci>
    </apply> 
  </apply>`;
    const parsed: IXmlJs = JSON.parse(
      xml.xml2json(mathml, { compact: false, spaces: 4 })
    );
    parsed.elements.forEach((elements) => removeCellMl(elements));
    console.log(parsed);
  });
  it("Converting with cellml references", async () => {
    const mathml = `<apply><eq/> 
    <apply><diff/>
      <bvar><ci>t</ci></bvar>
      <ci>y</ci>
    </apply>
    <apply><minus/>
      <apply><times/>
        <ci>u</ci>
        <apply><minus/>
          <cn cellml:units="ms_squared">1</cn> 
          <apply><power/> 
            <ci>x</ci>
            <cn cellml:units="dimensionless">2</cn>
          </apply>
        </apply> 
        <ci>y</ci>
      </apply> 
      <ci>x</ci>
    </apply> 
  </apply>`;
    const parsed: IXmlJs = JSON.parse(
      xml.xml2json(mathml, { compact: false, spaces: 4 })
    );
    parsed.elements.forEach((elements) => removeCellMl(elements));
    const jsoned = xml.json2xml(JSON.stringify(parsed), {
      spaces: 4,
    });
    console.log(jsoned);
  });
});
