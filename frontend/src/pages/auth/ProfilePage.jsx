import {
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { logout, updateUserStore } from '../../reduxStore/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { Form, useForm } from '../../components/useForm';
import Controls from '../../components/controls/Controls';
import states from '../../utils/states';
import { useEffect } from 'react';
import { useState } from 'react';

const initialValues = {
  name: '',
  address: '',
  apt: '',
  city: '',
  state: '',
  zipcode: '',
  phone: '',
  email: '',
  storeInfo: '',
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userData);
  const [enableUpdate, setEnableUpdate] = useState(false);
  const handleEnableUpdate = () => {
    setEnableUpdate(!enableUpdate);
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ('name' in fieldValues)
      temp.name = fieldValues.name.length !== 0 ? '' : 'Name is required.';

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
      temp.email = /$^|.+@.+..+/.test(fieldValues.email)
        ? ''
        : 'Email is not valid.';

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === '');
  };

  const updateUserInfo = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(updateUserStore(values));
    }
  };

  const { values, errors, handleInputChange, setValues, setErrors } = useForm(
    initialValues,
    true,
    validate
  );

  useEffect(() => {
    if (user && user.store) {
      const addressFormatted = {
        ...user.store,
        address: user.store.address.street,
        apt: user.store.address.apt,
        city: user.store.address.city,
        state: user.store.address.state,
        zipcode: user.store.address.zipcode,
      };
      setValues({ ...addressFormatted });
    }
  }, [user]);
  return (
    <div
      className='profile'
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        maxWidth: '1300px',
        width: '80vw',
        margin: 'auto',
      }}
    >
      <Grid container alignContent='center' justify='center' direction='column'>
        <Grid
          item
          container
          justify='space-between'
          style={{ marginBottom: '15px' }}
        >
          <Typography variant='h5'>Store Profile</Typography>
          <Grid item>
            <Button
              variant='outlined'
              onClick={() => dispatch(logout())}
              color='secondary'
            >
              Log Out
            </Button>
            <Divider />
          </Grid>

          <Grid item container>
            <Grid item xs={12} sm={6}>
              <Paper style={{ width: '100%' }}>
                <Form style={{ width: '95%' }} onSubmit={updateUserInfo}>
                  <Controls.Input
                    name='name'
                    error={errors.name}
                    value={values.name}
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    onChange={handleInputChange}
                    label='Business Name'
                  />
                  <Controls.Input
                    name='address'
                    error={errors.address}
                    value={values.address}
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    onChange={handleInputChange}
                    label='Business Address'
                  />
                  <Controls.Input
                    name='apt'
                    value={values.apt}
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    onChange={handleInputChange}
                    label='Apt, Floor or Suite'
                  />
                  <Controls.Input
                    name='city'
                    value={values.city}
                    inputProps={{ style: { textTransform: 'capitalize' } }}
                    error={errors.city}
                    onChange={handleInputChange}
                    label='City'
                  />

                  <Controls.Select
                    name='state'
                    value={values.state}
                    error={errors.state}
                    onChange={handleInputChange}
                    label='Select a State'
                    options={states}
                  />
                  <Controls.Input
                    name='zipcode'
                    value={values.zipcode}
                    error={errors.zipcode}
                    onChange={handleInputChange}
                    label='Zip Code'
                  />
                  <Controls.Input
                    name='email'
                    value={values.email}
                    error={errors.email}
                    onChange={handleInputChange}
                    label='Business Email Address'
                  />
                  <Controls.Input
                    name='phone'
                    error={errors.phone}
                    value={values.phone}
                    onChange={handleInputChange}
                    label='Business Phone Number'
                  />
                  <Controls.Input
                    name='storeInfo'
                    value={values.storeInfo}
                    onChange={handleInputChange}
                    label='Business Description'
                    placeholder='Enter a brief description about your business'
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={enableUpdate}
                        onChange={handleEnableUpdate}
                        name='checked'
                        color='primary'
                      />
                    }
                    style={{ paddingLeft: '10px' }}
                    label='Enable Update'
                  />
                  <Controls.Button
                    disabled={!enableUpdate}
                    text='UPDATE STORE INFO'
                    type='submit'
                    fullWidth
                  />
                </Form>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className='store_detail_list'>
                <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>
                  Store Details
                </h3>
                <p className='capitalize'>
                  <strong>Business Name:</strong> {user.store.name}
                </p>
                <p className='capitalize'>
                  <strong>Business Address:</strong> {user.store.address.street}{' '}
                  {user.store.apt}
                </p>
                <p className='capitalize'>
                  <strong>Business Address Line 2:</strong>{' '}
                  {user.store.address.city}, {user.store.address.state}{' '}
                  {user.store.address.zipcode}
                </p>
                <p className='capitalize'>
                  <strong>Business Email:</strong> {user.store.email}
                </p>
                <p className='capitalize'>
                  <strong>Business phone:</strong> {user.store.phone}
                </p>
                <p className='capitalize'>
                  <strong>Business Description:</strong> {user.store.storeInfo}
                </p>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfilePage;
