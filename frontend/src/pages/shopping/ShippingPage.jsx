import { Checkbox, FormControlLabel, Grid } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Form, useForm } from '../../components/useForm';
import Controls from '../../components/controls/Controls';
import states from '../../utils/states';
import { signup } from '../../reduxStore/actions/userActions';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/Message';

const initialValues = {
  name: '',
  lastName: '',
  address: '',
  apt: '',
  city: '',
  state: '',
  zipcode: '',
  phone: '',
  email: '',
};

const ShippingPage = ({ history }) => {
  const dispatch = useDispatch();
  const { error, user } = useSelector((state) => state.userData);
  const [emailError, setEmailError] = useState(null);
  const [createAccount, setCreateAccount] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [password, setPassword] = useState('');
  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ('name' in fieldValues)
      temp.name = fieldValues.name ? '' : 'Name is required';

    if ('lastName' in fieldValues)
      temp.lastName =
        fieldValues.lastName.length !== 0 ? '' : 'Last Name is required.';
    if ('address' in fieldValues)
      temp.address =
        fieldValues.address.length !== 0 ? '' : 'Address is required.';
    if ('city' in fieldValues)
      temp.city = fieldValues.city.length !== 0 ? '' : 'City is required.';
    if ('state' in fieldValues)
      temp.state = fieldValues.state.length !== 0 ? '' : 'State is required.';
    if ('zipcode' in fieldValues)
      temp.zipcode =
        fieldValues.zipcode.length !== 0 ? '' : 'Postal code is required.';
    if ('zipcode' in fieldValues)
      temp.zipcode =
        fieldValues.zipcode.length === 5 ? '' : '5 digits zip code required.';
    if ('phone' in fieldValues)
      temp.phone = fieldValues.phone.length !== 0 ? '' : 'Phone is required.';
    if ('phone' in fieldValues)
      temp.phone =
        fieldValues.phone.length >= 10 && fieldValues.phone.length > 1
          ? ''
          : 'Invalid phone.';

    if ('email' in fieldValues)
      temp.email = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
        fieldValues.email
      )
        ? ''
        : 'Email is not valid.';

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === '');
  };

  const {
    values,
    handleInputChange,
    errors,
    setErrors,
    resetForm,
    setValues,
  } = useForm(initialValues, true, validate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      if (values.email === '') {
        setEmailError('An email is required');
        // setTimeout(() => {
        //   setEmailError(null);
        // }, 3000);
        return;
      }
      if (createAccount && password === '') {
        setPasswordError('password is needed for your account');
        return;
      }
      try {
        localStorage.setItem('shippingAddress', JSON.stringify(values));
        if (createAccount) {
          //create account for customer
          const registered = await dispatch(
            signup({
              name: values.name,
              lastName: values.lastName,
              email: values.email,
              password: password,
            })
          );
          if (!registered) {
            return;
          }
        }
        history.push('/order-summary');
      } catch (error) {
        console.error(error);
        return;
      }

      // resetForm()
    }
  };

  const handleCreateAccount = () => {
    setCreateAccount(!createAccount);
  };

  useEffect(() => {
    const shipping = localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : null;

    if (shipping) {
      setValues({ ...shipping });
    }
    // eslint-disable-next-line
  }, [user]);
  return (
    <div
      className='main'
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '1080px',
        margin: '30px auto',
      }}
    >
      <Grid container alignItems='center' justify='center' direction='column'>
        <h2 style={{ textAlign: 'center', padding: '1rem' }}>
          Shipping Address
        </h2>

        <Form onSubmit={handleSubmit}>
          {error && <Message type='error'>{error}</Message>}
          <Grid item container>
            <Grid item xs={6} md={6}>
              <Controls.Input
                name='name'
                autoFocus
                value={values.name}
                inputProps={{ style: { textTransform: 'capitalize' } }}
                error={errors.name}
                onChange={handleInputChange}
                label='First Name'
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <Controls.Input
                name='lastName'
                value={values.lastName}
                inputProps={{ style: { textTransform: 'capitalize' } }}
                error={errors.lastName}
                onChange={handleInputChange}
                label='Last Name'
              />
            </Grid>
          </Grid>
          <Grid item container>
            <Grid item xs={7} md={6}>
              <Controls.Input
                name='address'
                value={values.address}
                inputProps={{ style: { textTransform: 'capitalize' } }}
                error={errors.address}
                onChange={handleInputChange}
                label='Address'
                placeholder='Ex. 123 Main St'
              />
            </Grid>
            <Grid item xs={5} md={6}>
              <Controls.Input
                name='apt'
                value={values.apt}
                onChange={handleInputChange}
                inputProps={{ style: { textTransform: 'uppercase' } }}
                label='Apartment / Suite'
                placeholder='Ex. Apt 1A'
              />
            </Grid>
          </Grid>
          <Grid item container>
            <Grid item xs={7} md={6}>
              <Controls.Input
                name='city'
                value={values.city}
                error={errors.city}
                inputProps={{ style: { textTransform: 'capitalize' } }}
                onChange={handleInputChange}
                label='City'
                placeholder='Please enter your city'
              />
            </Grid>
            <Grid item xs={5} md={6}>
              <Controls.Select
                name='state'
                value={values.state}
                error={errors.state}
                inputProps={{ style: { textTransform: 'capitalize' } }}
                onChange={handleInputChange}
                label='State'
                options={states}
                placeholder='Please enter your state'
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Controls.Input
              name='zipcode'
              value={values.zipcode}
              inputProps={{ maxLength: 5 }}
              error={errors.zipcode}
              type='numeric'
              onChange={handleInputChange}
              label='Postal Code'
              placeholder='Ex 12345'
            />
            <Controls.Input
              name='phone'
              type='tel'
              value={values.phone}
              error={errors.phone}
              onChange={handleInputChange}
              label='Phone'
              placeholder='Ex. (555)-555-0000'
            />
            <Controls.Input
              name='email'
              type='email'
              value={values.email}
              error={errors.email || emailError}
              inputProps={{ style: { textTransform: 'lowercase' } }}
              onChange={handleInputChange}
              label='Email Address'
              placeholder='Ex. johndoe@email.com'
            />

            {createAccount && (
              <Controls.Input
                name='password'
                label='Password'
                type='password'
                error={passwordError}
                placeholder='Enter a password for your account'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </Grid>
          {!user && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    style={{ paddingLeft: '15px' }}
                    checked={createAccount}
                    onChange={handleCreateAccount}
                    name='account'
                  />
                }
                label='create account'
                style={{ color: 'gray' }}
              />
            </Grid>
          )}

          <div className='btn_div'>
            <Controls.Button text='Continue to Payment' type='submit' />
            <Controls.Button
              text='Reset Form'
              color='secondary'
              onClick={resetForm}
            />
          </div>
        </Form>

        <Grid item xs={12} md={5}></Grid>
      </Grid>
    </div>
  );
};

export default ShippingPage;
