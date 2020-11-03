import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Alert, AlertTitle}  from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const  Message = (props) => {
  const classes = useStyles();
  const {type} = props

  return (
    <div className={classes.root}>
      
      <Alert severity={type}>
        <AlertTitle className='capitalize'>{type}</AlertTitle>
        {props.children}
      </Alert>
    
    </div>
  );
}

export default Message