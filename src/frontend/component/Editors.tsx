import { Alert } from "@material-ui/lab";
import { ConciseView } from "./../editor/concise/ConciseView";
import { RawView } from "./../editor/raw/RawView";
import React, { Dispatch, FunctionComponent } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

interface IEditorGeneric {
  valid: boolean;
  contentExist: string;
  setContentExist: Dispatch<string>;
}

const Editors: FunctionComponent<IEditorGeneric> = ({
  valid,
  contentExist,
  setContentExist,
}) => {
  return (
    <Switch>
      <Route path="/concise">
        {!valid && <Redirect to="" />}
        {valid && (
          <ConciseView
            contentExist={contentExist}
            setContentExist={setContentExist}
            // key="concise-view"
            key={contentExist}
          />
        )}
      </Route>

      <Route exact path="">
        {!valid && (
          <Alert severity="error">
            File is not in valid CellML. You cannot use Concise View without
            fixing this.
          </Alert>
        )}
        <RawView
          setContentExist={setContentExist}
          contentExist={contentExist}
          key="raw-view"
        />
      </Route>
    </Switch>
  );
};

export { Editors };
