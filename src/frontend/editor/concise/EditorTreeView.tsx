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
  Chip,
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
    // maxWidth: "100vh",
    marginTop: "8px",
  },
  record: {
    margin: "2px",
    padding: "4px",
    border: "1px solid lightgrey",
    borderRadius: "10px",
  },
  content: {
    paddingTop: "0px",
    paddingBottom: "0px",
  },
  button: {
    paddingTop: "0px",
    paddingBottom: "0px",
    marginTop: "0px",
    marginBottom: "0px",
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
  const selectElement: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    window.api.send("move-to", selection);
  };

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
          if (key === "math") {
            return <Chip color="primary" label="math" />;
          }
          return (
            <>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Grid item>
                <Typography variant="subtitle2">{key}:</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  {value}{" "}
                </Typography>
              </Grid>
            </>
          );
        })}
        {element.name !== "unit" && (
          <Grid item className={style.button}>
            <IconButton onClick={selectElement}>
              <SearchIcon />
            </IconButton>
          </Grid>
        )}
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

  const renderTree = (
    nodes: IXmlElement,
    index: number,
    elementIndex: number,
    parent?: string
  ) => {
    // const id = parent + nodes.name + index + JSON.stringify(nodes.attributes);
    const id = nodes.name + JSON.stringify(nodes.attributes);

    const selection: IMoveTo = {
      element: strToElm(nodes.name),
      search: { index: elementIndex, name: nodes.attributes?.name },
      parent: parent ? parent : "",
    };
    return (
      <TreeItem
        key={id}
        nodeId={id}
        label={<ElementRecord key={id} element={nodes} selection={selection} />}

        // className={classes.group}
      >
        {Array.isArray(nodes.elements)
          ? nodes.elements.map((node, i) => {
              let indexCount = 0;
              console.log(nodes.attributes?.name);
              console.log("BEGIN to " + i);
              for (let j = 0; j < i; j++) {
                if (nodes.elements[j].name === nodes.elements[i].name) {
                  indexCount = indexCount + 1;
                  console.log("MATCH! " + indexCount);
                } else {
                  console.log(
                    nodes.elements[j].name + " != " + nodes.elements[i].name
                  );
                }
              }
              console.log(indexCount);
              console.log("END");
              return renderTree(node, i, indexCount, nodes.attributes?.name);
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
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(richObject.elements[0], 0, 0)}
    </TreeView>
  );
};

export { EditorTreeView };
