import React from 'react';
import { TextField } from '@material-ui/core';

export default function Input({
  name,
  label,
  value,
  error = null,
  focused = false,
  onChange,
  ...others
}) {
  return (
    <TextField
      variant='outlined'
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      focused={focused}
      {...others}
      {...(error && { error: true, helperText: error })}
    />
  );
}
