import React, { FunctionComponent, MouseEventHandler } from "react";
import { Elements, elmToStr, strToElm } from "../../../../types/Elements";
import { IChild } from "../../../../types/IProperties";
import { ISearch, ISelect } from "../../../../types/IQuery";
import PropertyIcon from "./PropertyIcon";
import Grid from "@material-ui/core/Grid";
import {
  Box,
  Button,
  createStyles,
  Divider,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { capitaliseFirst } from "../../../../utility/CapitaliseFirst";
import { DeleteButton } from "./DeleteChildren";

const findElement = (elm: Elements, name: string, index: number) => {
  const select: ISearch = { index, name };
  const query: ISelect = { element: elm, select };
  console.log(`Looking for ${elmToStr(elm)}`);
  console.log(query);
  switch (elm) {
    case Elements.component:
    case Elements.units:
    case Elements.reset:
    case Elements.variable:
      window.api.send("find-element-from-children", query);
      break;
    default:
      console.log("Error: Not a valid element type");
  }
};

interface IChildrenWidget {
  abstractChildren: Record<string, IChild[]>;
  parentType: Elements;
  resetChanges: () => void;
}

const useStyle = makeStyles(() =>
  createStyles({
    childCategory: {
      marginTop: "1vh",
    },
    childElement: {
      marginTop: "5px",
    },
  })
);

const ChildrenWidget: FunctionComponent<IChildrenWidget> = ({
  abstractChildren,
  parentType,
  resetChanges,
}) => {
  if (!abstractChildren) {
    return <div>NO CHILD</div>;
  }

  const styles = useStyle();
  return (
    <Grid
      item
      xs={12}
      // key={Object.entries(abstractChildren)
      //   .map(([parentKey, childrenType]) => {
      //     return childrenType
      //       .map((attrType: IChild) => {
      //         return attrType.name;
      //       })
      //       .join("-");
      //   })
      //   .join("-")}
    >
      <Box style={{ height: "100%", backgroundColor: "#fff" }}>
        {Object.entries(abstractChildren).length > 0 && (
          <Typography variant="h4" style={{ paddingLeft: "5px" }}>
            Children
          </Typography>
        )}

        {Object.entries(abstractChildren).map(([parentKey, childrenType]) => {
          if (childrenType.length > 0)
            return (
              <div
                key={parentKey}
                className={styles.childCategory}
                style={{ paddingLeft: "1vw" }}
              >
                <Divider variant="middle" />
                <Typography variant="h5">
                  {capitaliseFirst(parentKey)}
                </Typography>
                {Object.values(childrenType).map(
                  (attrType: IChild, index: number) => {
                    return (
                      <PropertyIcon
                        title={attrType.name}
                        onClick={() => {
                          findElement(
                            Elements[parentKey as keyof typeof Elements],
                            attrType.name ? attrType.name : "",
                            attrType.index
                          );
                          resetChanges();
                        }}
                        element={parentKey}
                        key={attrType.name}
                        index={index}
                        parentName={attrType.parentName}
                      />
                    );
                  }
                )}
              </div>
            );
        })}
      </Box>
    </Grid>
  );
};

export { ChildrenWidget };
