import React from "react";
import { Theme } from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { EditorXml } from "./EditorXml";
import { compressCellml } from "../../../backend/compressCellml";
import { IEditorProp } from "../IEditorProp";
import { FunctionComponent } from "react";

const localStyles = makeStyles((theme: Theme) =>
  createStyles({
    spatialView: {
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
    <div className={styles.spatialView}>
      <EditorXml xmlInput={compressCellml(contentExist)} />
    </div>
  );
};

export { ConciseView };
