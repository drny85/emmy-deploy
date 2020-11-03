import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Table,
  TableContainer,
  IconButton,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import axios from '../../utils/axios';
import { Form, useForm } from '../../components/useForm';
import Controls from '../../components/controls/Controls';
import { useSelector } from 'react-redux';
import moment from 'moment';

const initialValues = { code: '', value: '', expires: '' };

const CouponsPages = () => {
  const { user } = useSelector((state) => state.userData);
  const [mode, setMode] = useState('add');
  const [couponId, setCouponId] = useState(null);
  const [coupons, setCoupons] = useState([]);
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
        if (mode === 'add') {
          const { data } = await axios.post('/api/coupons', values, config);
          setCoupons(data);
          resetForm();
        } else if (mode === 'update') {
          const { data } = await axios.put(
            `/api/coupons/${couponId}`,
            values,
            config
          );
          setCoupons(data);
          resetForm();
        }
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

  const getCoupons = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.get('/api/coupons', config);

      setCoupons(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCoupon = async (id) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.delete(`api/coupons/${id}`, config);
      setCoupons(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCoupons();
    // eslint-disable-next-line
  }, [coupons.length]);
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
        <Form style={{ width: '100%' }} onSubmit={addCoupon}>
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

          <Grid item container>
            <Controls.Button
              type='submit'
              text={mode === 'add' ? 'Add Coupon' : 'Update coupon'}
              color={mode === 'add' ? 'primary' : 'secondary'}
            />
            {mode === 'update' && (
              <Controls.Button
                onClick={() => {
                  setMode('add');
                  resetForm();
                }}
                style={{ backgroundColor: '#ff7043' }}
                text='Cancel Update'
              />
            )}
          </Grid>
        </Form>
      </Grid>
      <Grid item container>
        {coupons.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead
                style={{
                  fontWeight: 'bold',
                  background:
                    'linear-gradient(90deg, rgba(52,56,55,0.7231267507002801), #ffffff)',
                }}
              >
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Expires On</TableCell>

                  <TableCell align='center'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupons.map((coupon, i) => (
                  <TableRow key={coupon._id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>{coupon.value}%</TableCell>
                    <TableCell>{moment(coupon.expires).format('LL')}</TableCell>
                    <TableCell align='center'>
                      <IconButton
                        onClick={() => {
                          setValues(coupons.find((c) => c._id === coupon._id));
                          setCouponId(coupon._id);
                          setMode('update');
                        }}
                      >
                        <EditIcon color='action' />
                      </IconButton>
                      <IconButton onClick={() => deleteCoupon(coupon._id)}>
                        <DeleteOutlineIcon color='error' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
    </div>
  );
};

export default CouponsPages;
