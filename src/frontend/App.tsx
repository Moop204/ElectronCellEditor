import * as React from "react";
import { Dashboard } from "./Dashboard";
import MathJax from "mathjax3-react";

const App = () => {
  return (
    <MathJax.Provider>
      <Dashboard />
    </MathJax.Provider>
  );
};

export { App };
