global.Buffer = global.Buffer || require("buffer").Buffer;

import React from "react";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { EditorXml } from "./EditorXml";
import { compressCellml } from "../../../backend/compressCellml";
import { IEditorProp } from "../IEditorProp";
import { FunctionComponent } from "react";

import "./css/xonomy.css";

const localStyles = makeStyles(() =>
  createStyles({
    conciseView: {
      paddingLeft: "3vh",
    },
    notLoaded: {
      textAlign: "center",
      height: "40vh",
    },
  })
);

// Updated through ipc calls to the backend
const ConciseView: FunctionComponent<IEditorProp> = ({ contentExist }) => {
  const styles = localStyles();
  if (contentExist === "") {
    return <div className={styles.notLoaded}>No File Loaded</div>;
  }
  return (
    <div className={styles.conciseView}>
      <EditorXml xmlInput={compressCellml(contentExist)} />
    </div>
  );
};

export { ConciseView };