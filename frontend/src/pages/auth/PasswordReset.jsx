import { Button, Divider, FormControl, TextField } from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Message from '../../components/Message';
import { autoLoginUser } from '../../reduxStore/actions/userActions';
import axios from '../../utils/axios';
import responseError from '../../utils/responseError';

const PasswordReset = ({ match, history }) => {
  const dispatch = useDispatch();
  const token = match.params.token;
  console.log(token);
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);

  const updatePassword = async () => {
    try {
      const { data } = await axios.put(`/api/users/reset/${token}`, {
        password: newPassword,
      });
      if (data) {
        dispatch(autoLoginUser(data));
        setError(null);
        setConfirm('');
        setNewPassword('');

        history.replace('/');
      }
    } catch (error) {
      console.error(responseError(error));
      setError(responseError(error));
    }
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        maxWidth: '1200px',
        marginTop: '50px',
        margin: 'auto',
      }}
    >
      <h3 style={{ margin: '20px' }}>Reset Password</h3>
      <FormControl fullWidth>
        {error && <Message type='error'>{error}</Message>}
        <div style={{ height: '20px' }} />
        <TextField
          value={newPassword}
          style={{ marginBottom: '30px' }}
          type='password'
          label='New Password'
          variant='outlined'
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          value={confirm}
          type='password'
          style={{ marginBottom: '30px' }}
          label='Confirm Password'
          error={newPassword !== confirm && confirm !== ''}
          variant='outlined'
          onChange={(e) => setConfirm(e.target.value)}
          helperText={
            newPassword !== confirm &&
            confirm !== '' &&
            'password dot not match'
          }
        />

        <Button
          onClick={updatePassword}
          disabled={newPassword !== confirm || newPassword === ''}
          variant='outlined'
          color='primary'
        >
          Update Password
        </Button>
      </FormControl>
    </div>
  );
};

export default PasswordReset;
