import * as React from "react";
import { useStyles } from "./style";

const SubHeader = (props) => {
  const styles = useStyles();
  const { title } = props;
  return (
    <div className={styles.subheading} >
      {title}
    </div>
  );
};

export { SubHeader };
