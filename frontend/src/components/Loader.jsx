import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      alignSelf:'center',
      justifyContent: 'center',
      alignItems: 'center',
      position:'absolute',
      top: '50%',
      left: '50%',
      transform: 'traslate(-50%, -50%)'
      
      
    
    },
  }));

const Loader = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
        
        <CircularProgress color="secondary" />
      </div>
    )
}

export default Loader
