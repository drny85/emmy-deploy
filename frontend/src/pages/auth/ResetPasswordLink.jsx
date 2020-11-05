import { Button, FormControl, TextField } from '@material-ui/core';
import axios from '../../utils/axios';
import React from 'react';
import { useState } from 'react';
import Message from '../../components/Message';
import responseError from '../../utils/responseError';

const ResetPasswordLink = ({ history }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [success, setSuccess] = useState(false);

  const checkEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
        value
      )
    );
  };

  const sendLink = async () => {
    try {
      const { data } = await axios.post('/api/users/reset', { email: email });
      if (data) {
        setSuccess(true);
        setTimeout(() => {
          history.replace('/login');
        }, 4000);
      }
    } catch (error) {
      console.error(error.response);
      setError(error.response.data);
      setTimeout(() => {
        setError(null);
      }, 3000);
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
      {success ? (
        <p style={{ marginTop: '100px' }}>
          An email has been sent to {email} with instructions.
        </p>
      ) : (
        <>
          <h3 style={{ margin: '20px' }}>Request Password Reset Email</h3>
          <FormControl fullWidth>
            {error && <Message type='error'>{error}</Message>}
            <div style={{ height: '20px' }} />
            <TextField
              value={email}
              style={{ marginBottom: '30px' }}
              type='email'
              error={!isValid}
              label='Email'
              variant='outlined'
              helperText={
                email !== '' && !isValid && 'invalid email formatting'
              }
              onChange={checkEmail}
            />

            <Button
              onClick={sendLink}
              disabled={email === '' || !isValid}
              variant='outlined'
              color='primary'
            >
              Submit
            </Button>
          </FormControl>
        </>
      )}
    </div>
  );
};

export default ResetPasswordLink;
