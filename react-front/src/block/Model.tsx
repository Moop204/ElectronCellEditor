import { useStyles } from './Block'
import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { NewComponentBlock, SampleComponentBlock } from './Component';
import Grid from '@material-ui/core/Grid';
import NoteIcon from '@material-ui/icons/Note';
import AddIcon from '@material-ui/icons/Add';

const Layout = () => {
  return ( 
    <Grid container spacing={3}>
      < Grid item xs={12}> 
        <TextField
          required
          id="filled-required"
          label="Name"
          variant="filled"
          defaultValue="test_model_name"
        />
      </Grid> 
      < Grid item xs={12}> 
        <SampleComponentBlock/>
      </Grid> 
      < Grid item xs={12}> 
        <NewComponentBlock/>
      </Grid> 
    </Grid> 
  );
}


const NewModel = () => {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };
  const style = useStyles();
  return (
    <Accordion onChange={handleChange('panel1')}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      > 
        <Typography className={style.heading}><AddIcon/><NoteIcon/>Model</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TextField
          required
          id="filled-required"
          label="Name"
          variant="filled"
        />
      </AccordionDetails> 

    </Accordion>
  )  
}

const Model = () => {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };
  const style = useStyles();
  return (
    <Accordion onChange={handleChange('panel1')}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      > 
        <Typography className={style.heading}><NoteIcon/>Model</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Layout/>
      </AccordionDetails> 

    </Accordion>
  )  
}

export { NewModel, Model }
