import React, { useState } from 'react';
import { Button, Divider, Grid, TextField } from '@material-ui/core';
import axios from '../../utils/axios';
import { Form, useForm } from '../../components/useForm';
import Controls from '../../components/controls/Controls';
import { useSelector } from 'react-redux';
import moment from 'moment';

const initialValues = { code: '', value: '', expires: '' };

const CouponsPages = () => {
  const { user } = useSelector((state) => state.userData);
  const addCoupon = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      };
      if (validate()) {
        values.value = Number(values.value);
        values.expires = moment(values.expires).endOf('day');
        const { data } = await axios.post('/api/coupons', values, config);
        console.log(data);
        resetForm();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ('code' in fieldValues)
      temp.code = fieldValues.code ? '' : 'Code is required';
    if ('value' in fieldValues)
      temp.value = fieldValues.value.length !== 0 ? '' : 'Value is required';
    if ('expires' in fieldValues)
      temp.expires =
        fieldValues.expires.length !== 0 ? '' : 'A date is required';

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
    setValues,
    setErrors,
    resetForm,
  } = useForm(initialValues, true, validate);
  console.log(values);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: '1200px',
        width: '90vw',
        margin: 'auto',
      }}
    >
      <div className='title'>
        <h3>Coupons</h3>
      </div>
      <Grid container alignContent='center'>
        <Form onSubmit={addCoupon}>
          <Controls.Input
            name='code'
            label='Coupon Code'
            error={errors.code}
            inputProps={{ style: { textTransform: 'uppercase' } }}
            value={values.code}
            onChange={handleInputChange}
          />
          <Controls.Input
            name='value'
            type='number'
            label='Coupon Percentage'
            error={errors.value}
            value={values.value}
            onChange={handleInputChange}
          />
          <Controls.Input
            name='expires'
            label='Expires On'
            error={errors.expires}
            type='date'
            value={values.expires}
            onChange={handleInputChange}
          />

          <Controls.Button type='submit' text='Add Coupon' />
        </Form>
      </Grid>
    </div>
  );
};

export default CouponsPages;
