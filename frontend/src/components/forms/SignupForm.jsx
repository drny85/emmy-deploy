import React from 'react';
import { Grid } from '@material-ui/core';
import Controls from '../controls/Controls';
import { useForm, Form } from '../useForm';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Message';
import { signup } from '../../reduxStore/actions/userActions';

const initialValues = {
  name: '',
  lastName: '',
  email: '',
  password: '',
  confirm: '',
};

const SignupForm = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.userData);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('name' in fieldValues)
      temp.name = fieldValues.name ? '' : 'Name is required.';
    if ('email' in fieldValues)
      temp.email = fieldValues.email.length !== 0 ? '' : 'Email is required';
    if ('email' in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email)
        ? ''
        : 'Email is not valid.';
    if ('lastName' in fieldValues)
      temp.lastName =
        fieldValues.lastName.length > 3 ? '' : 'Minimum 3 characters required.';
    if ('password' in fieldValues)
      temp.password =
        fieldValues.password.length !== 0 ? '' : 'Password is required.';
    if ('confirm' in fieldValues)
      temp.confirm =
        fieldValues.confirm === fieldValues.password
          ? ''
          : 'Passwords do not match.';
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === '');
  };

  const { values, handleInputChange, errors, setErrors, resetForm } = useForm(
    initialValues,
    true,
    validate
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log(values);
      dispatch(signup(values));
      resetForm();
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        {error && <Message type="danger">{error}</Message>}
        <Grid item container>
          <Grid item xs={12} md={6}>
            <Controls.Input
              name="name"
              value={values.name}
              inputProps={{ style: { textTransform: 'capitalize' } }}
              error={errors.name}
              label="First Name"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controls.Input
              name="lastName"
              value={values.lastName}
              inputProps={{ style: { textTransform: 'capitalize' } }}
              error={errors.lastName}
              label="Last Name"
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Controls.Input
            name="email"
            value={values.email}
            error={errors.email}
            label="Email"
            onChange={handleInputChange}
          />
          <Controls.Input
            name="password"
            type="password"
            value={values.password}
            error={errors.password}
            label="Password"
            onChange={handleInputChange}
          />
          <Controls.Input
            name="confirm"
            type="password"
            value={values.confirm}
            error={errors.confirm}
            label="Confirm Password"
            onChange={handleInputChange}
          />
          {/* <Controls.Select  /> */}
          <div style={{ marginTop: '15px' }}>
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
};

export default SignupForm;
