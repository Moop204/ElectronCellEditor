declare module "*.wasm" {
  const content: string;
  export default content;
}

declare module "libcellml.js" {
  const content: any;
  export default content;
}

declare module "libcellml.js/libcellml.common";

declare module "mathjax3-react";
