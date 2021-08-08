import { Typography } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { Elements } from "./../../../types/Elements";
import { PropertyIcon } from "../properties/children/PropertyIcon";
import { HelpPopup } from "./HelpPopup";

const ConnectionHelp: FunctionComponent = () => {
  const exampleCode = `
  <model xmlns="http://www.cellml.org/cellml/2.0#" name="m">
    <component name="c1">
      <variable name="v1" units="second" interface="private"/>
    </component>
    <component name="c2">
      <variable name="v2" units="second" interface="public"/>
    </component>
    <connection component_1="c1" component_2="c2">
      <map_variables variable_1="v1" variable_2="v2"/>
    </connection>
    <encapsulation>
      <component_ref component="c1">
        <component_ref component="c2"/>
      </component_ref>
    </encapsulation>
  </model>
  `;
  return (
    <HelpPopup pageRef={22} title="About CellML Connection">
      <Typography variant="body2">
        <br />
        Connection elements allow Components to interact with each other through
        shared Variables. To identify the two Variables to connect the Component
        that is their parent must be identified first and then the Variable can
        be chosen.
        <br />
        <b>Example</b>
        <pre>
          <code>{exampleCode}</code>
        </pre>
        <br />
      </Typography>
      <Typography variant="h6">How to add</Typography>
      After selecting the Connection element, click on the add Connection button
      with the <PropertyIcon element="connection" /> icon. The following form
      will appear. Select the Component which contains the Variable you are
      looking for before then selecting the Variable. After doing this for both
      the first and second Variable then click the "Add" button.
    </HelpPopup>
  );
};

export { ConnectionHelp };
