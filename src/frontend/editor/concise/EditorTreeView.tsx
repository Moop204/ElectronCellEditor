import React, { FunctionComponent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import convert from "xml-js";
import { IEditorXml } from "./EditorXml";
import { IXmlElement, IXmlJs } from "../../../backend/compressCellml";
interface RenderTree {
  id: string;
  name: string;
  children?: RenderTree[];
}

const data: RenderTree = {
  id: "root",
  name: "Parent",
  children: [
    {
      id: "1",
      name: "Child - 1",
    },
    {
      id: "3",
      name: "Child - 3",
      children: [
        {
          id: "4",
          name: "Child - 4",
        },
      ],
    },
  ],
};

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});

interface IElement {
  element: IXmlElement;
}

const ElementRecord: FunctionComponent<IElement> = ({ element }) => {
  return <div></div>;
};

const EditorTreeView: FunctionComponent<IEditorXml> = ({ xmlInput }) => {
  console.log(convert.xml2json(xmlInput, { compact: false, spaces: 4 }));
  const richObject: IXmlJs = JSON.parse(
    convert.xml2json(xmlInput, { compact: false, spaces: 4 })
  );

  const classes = useStyles();

  const renderTree = (nodes: IXmlElement, index: number) => {
    const id = nodes.name + index;
    let label: string;
    if (nodes.attributes.name) {
      label = nodes.attributes.name;
    } else if (nodes.name === "unit") {
      label = nodes.attributes?.prefix + nodes.attributes.units;
    }

    return (
      <TreeItem key={id} nodeId={id} label={label}>
        {Array.isArray(nodes.elements)
          ? nodes.elements.map((node, index) => renderTree(node, index))
          : null}
      </TreeItem>
    );
  };

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={["root"]}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(richObject.elements[0], 0)}
    </TreeView>
  );
};

export { EditorTreeView };
