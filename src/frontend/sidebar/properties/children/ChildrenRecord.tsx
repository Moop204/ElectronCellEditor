import {
  makeStyles,
  createStyles,
  Grid,
  Button,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  ListItemIcon,
} from "@material-ui/core";
import { title } from "process";
import React, { FunctionComponent, MouseEventHandler, useState } from "react";
import { Elements, strToElm } from "../../../../types/Elements";
import { DeleteButton } from "./DeleteButton";
import { PropertyIcon } from "./PropertyIcon";
import { RoundButton } from "../../../component/RoundButton";

interface IChildrenRecord {
  title: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  element: string;
  index: number;
  parentName?: string;
}

const useStyle = makeStyles(() =>
  createStyles({
    button: {
      marginTop: "0.5vh",
      paddingLeft: "3px",
      //marginLeft: "1vw",
      paddingRight: "0px",
      maxWidth: "16vw",
    },
    root: {
      flexGrow: 1,
    },
    buttonText: {
      paddingLeft: "8px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      justifyContent: "left",
      textAlign: "justify",
      textTransform: "none",
    },
  })
);

const ChildrenRecord: FunctionComponent<IChildrenRecord> = ({
  onClick,
  title,
  element,
  index,
  parentName,
}) => {
  const style = useStyle();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  // New implementation
  //           onClick={() => {
  //             window.api.send("update-attribute", [
  //               {
  //                 element: Elements.variable,
  //                 select: { name: title, index: index },
  //                 attribute: "connection",
  //                 value: parentName,
  //               },
  //             ]);
  //           }}

  // if(element==="connection") {
  //   return (
  //     <ListItem button onClick={handleOpen} dense>
  //     <ListItemIcon>
  //       <PropertyIcon element={element} />
  //     </ListItemIcon>
  //     <ListItemText primary={title} />
  //     <ListItemSecondaryAction>
  //       <IconButton edge="end" aria-label="delete">
  //         <DeleteButton
  //           elementType={strToElm(element)}
  //           name={title}
  //           index={index}
  //         />
  //       </IconButton>
  //     </ListItemSecondaryAction>
  //   </ListItem>

  //   )
  // }

  return (
    <RoundButton>
      <ListItem button onClick={onClick} dense>
        <ListItemIcon>
          <PropertyIcon element={element} />
        </ListItemIcon>
        <ListItemText primary={title} />
        <ListItemSecondaryAction>
          <DeleteButton
            elementType={strToElm(element)}
            name={title}
            index={index}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </RoundButton>
  );
};

export { ChildrenRecord };
