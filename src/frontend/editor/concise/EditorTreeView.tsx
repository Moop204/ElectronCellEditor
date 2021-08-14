import SearchIcon from "@material-ui/icons/Search";
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
  IconButton,
  ListItemSecondaryAction,
  Typography,
} from "@material-ui/core";
import { PropertyIcon } from "../../sidebar/properties/children/PropertyIcon";
import { strToElm } from "../../../types/Elements";
import { IDirectSelect } from "../../../types/IQuery";
import { IMoveTo } from "../../../backend/moveTo/interfaces";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: "100vh",
    marginTop: "8px",
  },
  record: {
    margin: "2px",
    padding: "10px",
    border: "1px solid lightgrey",
    borderRadius: "10px",
  },
  content: {
    paddingTop: "0px",
    paddingBottom: "0px",
  },

  // group: {
  //   marginLeft: 7,
  //   paddingLeft: 18,
  //   borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  // },
}));

interface IElement {
  element: IXmlElement;
  selection: IMoveTo;
}

const ElementRecord: FunctionComponent<IElement> = ({ element, selection }) => {
  const style = useStyles();

  return (
    <div className={style.record}>
      <Grid
        container
        direction="row"
        spacing={2}
        alignItems="center"
        className={style.content}
      >
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
        <Grid item className={style.content}>
          <IconButton
            className={style.content}
            onClick={(e) => {
              e.stopPropagation();
              window.api.send("move-to", selection);
            }}
          >
            <SearchIcon />
          </IconButton>
        </Grid>
      </Grid>
      {/* <Grid
        item
        style={{ paddingTop: "0px", paddingBottom: "0px" }}
        className={style.content}
      > */}
      {/* </Grid> */}
    </div>
  );
};

const EditorTreeView: FunctionComponent<IEditorXml> = ({ xmlInput }) => {
  console.log(convert.xml2json(xmlInput, { compact: false, spaces: 4 }));
  const richObject: IXmlJs = JSON.parse(
    convert.xml2json(xmlInput, { compact: false, spaces: 4 })
  );

  const classes = useStyles();

  const renderTree = (nodes: IXmlElement, index: number, parent?: string) => {
    const id = parent + nodes.name + index + JSON.stringify(nodes.attributes);

    const selection: IMoveTo = {
      element: strToElm(nodes.name),
      search: { index, name: nodes.attributes?.name },
      parent: parent ? parent : "",
    };
    return (
      <TreeItem
        key={id}
        nodeId={id}
        label={<ElementRecord element={nodes} selection={selection} />}

        // className={classes.group}
      >
        {Array.isArray(nodes.elements)
          ? nodes.elements.map((node, i) => {
              let indexCount = 0;
              console.log("BEGIN");
              for (let j = 0; j < i; j++) {
                if (nodes.elements[j].name === nodes.name) {
                  indexCount = indexCount + 1;
                } else {
                  console.log(nodes.elements[j].name + " != " + nodes.name);
                }
              }
              console.log(indexCount);
              console.log("END");
              return renderTree(node, indexCount, nodes.attributes?.name);
            })
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
      {renderTree(richObject.elements[0], 0)}
    </TreeView>
  );
};

export { EditorTreeView };
