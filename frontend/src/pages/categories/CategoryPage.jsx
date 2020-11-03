import {
  Container,
  Grid,
  List,
  ListItemText,
  ListItem,
  Paper,
  Typography,
  Divider,
  IconButton,
  Button,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Form, useForm } from '../../components/useForm';
import Controls from '../../components/controls/Controls';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory } from '../../reduxStore/actions/categoryActions';
import Message from '../../components/Message';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  getCategories,
  updateCategory,
  deleteCategory,
} from '../../reduxStore/actions/categoryActions';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Loader from '../../components/Loader';

const CategoryPage = ({ history }) => {
  const dispatch = useDispatch();
  const [_id, setId] = useState(null);
  const [mode, setMode] = useState('add');
  const { error, categories, loading } = useSelector(
    (state) => state.categoriesData
  );
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('name' in fieldValues)
      temp.name = fieldValues.name ? '' : 'This field is required.';
    if ('name' in fieldValues)
      temp.name =
        fieldValues.name.length > 3 ? '' : 'Required at least 3 characters';

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      if (mode === 'add') {
        const submmited = await dispatch(addCategory(values.name));

        if (submmited) {
          resetForm();
        }
      } else if (mode === 'edit') {
        const updated = await dispatch(
          updateCategory({ _id: _id, name: values.name })
        );
        if (updated) {
          resetForm();
          setMode('add');
        }
      }
    }
  };

  const handleUpdate = (categoryId) => {
    setMode('edit');
    const category = categories.find((c) => c._id === categoryId);
    setValues({ ...category });
    setId(categoryId);
  };

  const {
    values,
    handleInputChange,
    errors,
    setErrors,
    setValues,
    resetForm,
  } = useForm({ name: '' }, true, validate);
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div
      className='categories'
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '1200px',
        margin: 'auto',
      }}
    >
      <Paper
        style={{ padding: '10px', marginTop: '100px', minHeight: '400px' }}
        elevation={6}
      >
        <Button
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          color='primary'
          onClick={() => history.goBack()}
        >
          Back
        </Button>
        <Typography align='center' variant='h4'>
          Categories
        </Typography>
        <Grid
          container
          alignItems='center'
          justify='center'
          style={{ marginTop: '50px' }}
        >
          <Grid item xs={12} md={8} lg={8}>
            {error && <Message type='error'>{error}</Message>}
            <Form onSubmit={handleSubmit}>
              <Controls.Input
                name='name'
                value={values.name}
                label='Category Name'
                error={errors.name}
                onChange={handleInputChange}
              />

              <Controls.Button
                disabled={loading}
                type='submit'
                color={mode === 'add' ? 'primary' : 'secondary'}
                text={mode === 'add' ? 'Add Category' : 'Update Category'}
              />
            </Form>
          </Grid>
          <Divider light />
          <Grid item xs={12} md={8}>
            {categories.length > 0 && (
              <Paper style={{ marginTop: '10px' }}>
                <List>
                  {categories.length > 0 &&
                    categories.map((category) => (
                      <ListItem divider={true} key={category._id}>
                        <ListItemText
                          className='capitalize'
                          primary={category.name}
                        />
                        <IconButton
                          style={{ marginRight: '8px' }}
                          edge='end'
                          onClick={() => handleUpdate(category._id)}
                        >
                          <EditIcon htmlColor='orange' />
                        </IconButton>
                        <IconButton
                          edge='end'
                          onClick={() => dispatch(deleteCategory(category._id))}
                        >
                          <DeleteOutlineIcon htmlColor='#e57373' />
                        </IconButton>
                      </ListItem>
                    ))}
                </List>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default CategoryPage;
