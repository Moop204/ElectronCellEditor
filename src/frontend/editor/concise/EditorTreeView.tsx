import React, { FunctionComponent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import convert from "xml-js";
import { IEditorXml } from "./EditorXml";
import { IXmlElement, IXmlJs } from "../../../backend/compressCellml";
import {
  alpha,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@material-ui/core";
import { PropertyIcon } from "../../sidebar/properties/children/PropertyIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: "100vh",
  },
  record: {
    margin: "2px",
    padding: "10px",
    border: "1px solid lightgrey",
    borderRadius: "10px",
  },
  // group: {
  //   marginLeft: 7,
  //   paddingLeft: 18,
  //   borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  // },
}));

interface IElement {
  element: IXmlElement;
}

const ElementRecord: FunctionComponent<IElement> = ({ element }) => {
  const style = useStyles();

  return (
    <div className={style.record}>
      {/* <CardContent> */}
      <Grid container direction="row" spacing={2} alignItems="center">
        <Grid item>
          <PropertyIcon element={element.name} />
        </Grid>
        {Object.entries(element.attributes).map(([key, value]) => {
          return (
            <>
              <Divider orientation="vertical" flexItem />
              <Grid item>
                <Typography variant="subtitle2" style={{}}>
                  {key}:
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  {value}{" "}
                </Typography>
              </Grid>
            </>
          );
        })}
      </Grid>
      {/* </CardContent> */}
    </div>
  );
};

const EditorTreeView: FunctionComponent<IEditorXml> = ({ xmlInput }) => {
  console.log(convert.xml2json(xmlInput, { compact: false, spaces: 4 }));
  const richObject: IXmlJs = JSON.parse(
    convert.xml2json(xmlInput, { compact: false, spaces: 4 })
  );

  const classes = useStyles();

  const renderTree = (nodes: IXmlElement, index: string) => {
    const id = nodes.name + index + JSON.stringify(nodes.attributes);
    return (
      <TreeItem
        key={id}
        nodeId={id}
        label={<ElementRecord element={nodes} />}
        // className={classes.group}
      >
        {Array.isArray(nodes.elements)
          ? nodes.elements.map((node, i) => renderTree(node, index + i))
          : null}
      </TreeItem>
    );
  };

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      // defaultExpanded={["root"]}
      defaultExpanded={["1"]}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(richObject.elements[0], "0")}
    </TreeView>
  );
};

export { EditorTreeView };
