import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginLeft: 0,
    },
    elementType: {
      display: 'flex',
      justifyContent: 'flex-end',
      fontSize: '1.8em',
    },
    viewBackground: {
      color: '#EAFDF8',
    },
    subElementType: {
      display: 'flex',
      justifyContent: 'flex-end',
      fontSize: '1.2em',
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
      //justifyContent: 'space-between',
    },
    subheading: {
      borderBottom: 'solid',
      marginTop: '1vh',
      fontSize: '1.5em',
      marginBottom: '1vh',
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
    testProperties: {
      height: '100%',
    },
    notLoaded: {
      textAlign: 'center',
      height: '40vh',
    },
    properties: {
      height: '70vh',
      width: '100%',
      alignContent: 'flex-start',
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
