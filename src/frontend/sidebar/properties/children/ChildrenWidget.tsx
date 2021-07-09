import React, { FunctionComponent, MouseEventHandler } from "react";
import { Elements, elmToStr, strToElm } from "../../../../types/Elements";
import { IChild } from "../../../../types/IProperties";
import { ISearch, ISelect } from "../../../../types/IQuery";
import PropertyIcon from "./PropertyIcon";
import Grid from "@material-ui/core/Grid";
import { Box, Button, Divider, Paper, Typography } from "@material-ui/core";
import { capitaliseFirst } from "../../../../utility/CapitaliseFirst";

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

const ChildrenWidget: FunctionComponent<IChildrenWidget> = ({
  abstractChildren,
  parentType,
  resetChanges,
}) => {
  if (!abstractChildren) {
    return <div>NO CHILD</div>;
  }

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
          <Typography variant="h5" style={{ paddingLeft: "5px" }}>
            Children
          </Typography>
        )}

        {Object.entries(abstractChildren).map(([parentKey, childrenType]) => {
          return (
            <div key={parentKey}>
              <Divider variant="middle" />
              <Typography variant="h6" style={{ paddingLeft: "5px" }}>
                {capitaliseFirst(parentKey)}
              </Typography>
              {Object.values(childrenType).map(
                (attrType: IChild, index: number) => {
                  return (
                    <Grid container key={parentKey + "-" + attrType.name}>
                      <Grid item xs={10}>
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
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          onClick={() => {
                            window.api.send("delete-element", {
                              element: strToElm(parentKey),
                              select: { name: attrType.name, index: index },
                            });
                          }}
                        >
                          AYAYAYA
                        </Button>
                      </Grid>
                    </Grid>
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
