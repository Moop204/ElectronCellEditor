import * as React from "react";
import { Dashboard } from "./Dashboard";
import MathJax from "mathjax3-react";
import { SnackbarProvider } from "notistack";

const App = () => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MathJax.Provider>
        <Dashboard />
      </MathJax.Provider>
    </SnackbarProvider>
  );
};

export { App };
