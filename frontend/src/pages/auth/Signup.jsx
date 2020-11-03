import { Container, Divider, Grid, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import SignupForm from '../../components/forms/SignupForm';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

const Signup = ({ location }) => {
  const history = useHistory();
  const { user } = useSelector((state) => state.userData);
  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (user) {
      history.push(redirect);
    }
  }, [user, history, redirect]);

  return (
    <div
      className='signup'
      style={{
        maxWidth: '960px',
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
      }}
    >
      <Container>
        <Grid container direction='column' alignItems='center'>
          <Typography variant='h4'>Sign Up</Typography>
          <Divider variant='middle' light />
          <SignupForm />
        </Grid>

        <Grid item>
          <p style={{ padding: '12px 0px' }}>
            Have an account?{' '}
            <span>
              <Link to='/login'>Sign In</Link>
            </span>
          </p>
        </Grid>
      </Container>
    </div>
  );
};

export default Signup;
