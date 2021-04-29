import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginLeft: 0,
    },
    viewButton: {
      padding: theme.spacing(2),
      maxWidth: '12rem',
      textAlign: 'center',
      color: theme.palette.text.secondary,
      flexGrow: 1,
    },
    heading: {
      backgroundColor: 'black',
      flexgrow: '1',
      width: '100%',
      color: 'white',
      padding: '0.5rem',
      justifyContent: 'space-between',
    },
    subheading: {
      borderTop: 'solid',
      borderBottom: 'solid',
      marginTop: '1vh',
    },
    plainText: {
      color: 'black',
    },
    issueMarker: {
      color: 'red',
    },
    issueButtons: {
      height: '3vh',
      padding: '1vh',
      margin: '0px',
      borderRadius: '0px',
    },
    spatialView: {
      paddingLeft: '3vh',
    },
    notLoaded: {
      textAlign: 'center',
      height: '40vv',
    },
    properties: {
      height: '40vv',
    },
  })
);

const standardStyle = makeStyles((theme) => {
  createStyles({
    plainText: {
      color: 'black',
    },
  });
});

export { useStyles, standardStyle };
