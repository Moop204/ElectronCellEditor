import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const config1: monaco.languages.LanguageConfiguration = {
  brackets: [],
  autoClosingPairs: [
    // { open: "<", close: ">" },
    { open: "'", close: "'" },
    { open: '"', close: `"` },
    { open: "<apply>", close: `</apply>` },
    { open: "<ci>", close: `</ci>` },
    { open: "<cn>", close: `</cn>` },
    { open: "<piecewise>", close: `</piecewise>` },
    { open: "<piece>", close: `</piece>` },
    { open: "<otherwise>", close: `</otherwise>` },
    { open: "<logbase>", close: `</logbase>` },
    { open: "<degree>", close: `</degree>` },
    { open: "<reset_value>", close: `</reset_value>` },
    { open: "<test_value>", close: `</test_value>` },
    { open: "<encapsulation>", close: `</encapsulation>` },
  ],
  surroundingPairs: [
    // { open: "<", close: ">" },
    { open: "'", close: "'" },
    { open: '"', close: '"' },
  ],
};
export { config1 };
