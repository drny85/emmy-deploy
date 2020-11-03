
import React from 'react'
import { TextField } from '@material-ui/core';

export default function Input({ name, label, value,error=null, onChange, ...others }) {

   
    return (
        <TextField
            variant="outlined"
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            {...others}
            {...(error && {error:true,helperText:error})}
        />
    )
}