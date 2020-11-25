import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import axios from '../../utils/axios';
import { useDispatch, useSelector } from 'react-redux';

import ProductPreview from '../../components/ProductPreview';

import Controls from '../../components/controls/Controls';
import { Form, useForm } from '../../components/useForm';
import Loader from '../../components/Loader';
import {
  updateProduct,
  getProductById,
  resetProduct,
  deleteProduct,
} from '../../reduxStore/actions/products';
import { getCategories } from '../../reduxStore/actions/categoryActions';
import Message from '../../components/Message';

const initialValues = {
  name: '',
  description: '',
  price: '',
  category: '',
  imageUrl: '',
  estimatedDelivery: '',
  available: true,
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    minWidth: '560px',
    width: '90vw',
    margin: '0 auto',
    maxWidth: '1080px',
  },
  btn: {
    backgroundColor: theme.palette.error.main,
  },
}));

const ProductEdit = ({ match, history }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const [images, setImages] = useState({
    imageUrl: '',
    image1: '',
    image2: '',
    image3: '',
  });
  const productId = match.params.id;
  const { product, loading, error } = useSelector(
    (state) => state.productsData
  );

  const { categories } = useSelector((state) => state.categoriesData);

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('name' in fieldValues)
      temp.name = fieldValues.name ? '' : 'This field is required.';
    if ('description' in fieldValues)
      temp.description =
        fieldValues.description.length > 10
          ? ''
          : 'Minimum 10 characters required.';
    if ('price' in fieldValues)
      temp.price = fieldValues.price.length !== 0 ? '' : 'Price is required';

    if ('category' in fieldValues)
      temp.category =
        fieldValues.category.length !== 0 ? '' : 'category is required';

    if ('estimatedDelivery' in fieldValues)
      temp.estimatedDelivery =
        fieldValues.estimatedDelivery.length !== 0
          ? ''
          : 'Estimated delivery is required';

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

  const [isAvailable, setAvailable] = useState(values.available ? 'yes' : 'no');

  const handleImage = async (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    const formData = new FormData();
    formData.append('imageUrl', file);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post('/api/upload', formData, config);
      setImages({ ...images, [name]: data });
      setUploading(true);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const handleAvailabitity = (event) => {
    const value = event.target.value;
    if (value === 'yes') {
      setAvailable('yes');
      setValues({ ...values, available: true });
    } else {
      setAvailable('no');
      setValues({ ...values, available: false });
    }
    // setAvailable();
  };

  const handleClose = () => {
    setShow(false);
  };

  const confirmDelete = () => {
    handleDelete();
    setShow(false);
  };

  //delete product
  const handleDelete = async () => {
    try {
      const deleted = await dispatch(deleteProduct(productId));
      if (deleted) {
        history.replace('/admin/products');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imgs = null;
    if (validate()) {
      if (uploading) {
        values.imageUrl = images.imageUrl;
        imgs = [images.image1, images.image2, images.image3];
        if (imageUrl === '') {
          values.imageUrl = images.imageUrl;
        }
      }
      //
      setUploading(false);
      console.log(values);
      const updated = await dispatch(
        updateProduct({ ...values, images: imgs })
      );
      if (updated) {
        setImageUrl('');

        resetForm();
        history.push('/admin/products');
      }
    }
  };

  useEffect(() => {
    if (!product) {
      dispatch(getProductById(productId));
      dispatch(getCategories());
    }
    return () => {
      dispatch(resetProduct());
    };
    // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    if (product) {
      setValues({ ...product });
      setAvailable(product.available ? 'yes' : 'no');
      if (product.images) {
        setImages({
          imageUrl: product.imageUrl,
          image1: product.images[0],
          image2: product.images[1],
          image3: product.images[2],
        });
      }
    }
    // eslint-disable-next-line
  }, [product]);

  console.log(images);

  if (loading) return <Loader />;
  return (
    <div className={classes.root}>
      <Grid
        item
        container
        justify='space-between'
        style={{ padding: '20px 6px' }}
      >
        <Typography align='center' variant='h4'>
          Edit/Update Product
        </Typography>
        <Button
          startIcon={<DeleteOutlineIcon />}
          variant='contained'
          color='primary'
          className={classes.btn}
          onClick={() => setShow(true)}
        >
          Delete
        </Button>
      </Grid>
      <div
        style={{
          width: '95%',
          height: '0.5px',
          backgroundColor: 'gray',
          opacity: '0.4',
          margin: '10px 0px',
        }}
      />
      <Grid container>
        <Grid item xs={7}>
          <Form onSubmit={handleSubmit}>
            <Grid container>
              {error && <Message type='error'>{error}</Message>}
              <Divider orientation='vertical' flexItem />
              <Grid item sx={12} md={12}>
                <Controls.Input
                  name='name'
                  className='capitalize'
                  focused={true}
                  value={values.name}
                  error={errors.name}
                  label='Product Name'
                  onChange={handleInputChange}
                />
                <Controls.Input
                  name='description'
                  value={values.description}
                  error={errors.description}
                  label='Product Description'
                  onChange={handleInputChange}
                />
                <Controls.Input
                  name='price'
                  value={values.price}
                  error={errors.price}
                  type='number'
                  step='1'
                  min='0'
                  label='Price'
                  onChange={handleInputChange}
                />
                <Controls.Select
                  name='category'
                  value={values.category}
                  error={errors.category}
                  options={categories}
                  inputProps={{ styles: { textTransform: 'capitalize' } }}
                  label='Category or Collection'
                  onChange={handleInputChange}
                />

                <label
                  style={{ marginLeft: '10px', fontWeight: 'bold' }}
                  htmlFor='images'
                >
                  Pick Main Image
                </label>
                <Controls.Input
                  name='imageUrl'
                  label='Main Image'
                  focused={true}
                  type='file'
                  inputProps={{ autoFocus: true }}
                  onChange={handleImage}
                />
                <Grid item container>
                  <Grid item container sx={12}>
                    <label
                      style={{ marginLeft: '10px', fontWeight: 'bold' }}
                      htmlFor='images'
                    >
                      Pick Thumbnail Images
                    </label>
                  </Grid>
                  <Grid item sm={4}>
                    <Controls.Input
                      name='image1'
                      label='Image 1'
                      focused={true}
                      type='file'
                      inputProps={{
                        autoFocus: true,
                      }}
                      onChange={handleImage}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <Controls.Input
                      name='image2'
                      label='Image 2'
                      focused={true}
                      type='file'
                      inputProps={{ autoFocus: true }}
                      onChange={handleImage}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <Controls.Input
                      name='image3'
                      label='Image 3'
                      focused={true}
                      type='file'
                      inputProps={{ autoFocus: true }}
                      onChange={handleImage}
                    />
                  </Grid>
                </Grid>

                <Controls.Input
                  name='estimatedDelivery'
                  value={values.estimatedDelivery}
                  label='Estimated Delivery Days'
                  onChange={handleInputChange}
                />
                <Controls.RadioGroup
                  name='available'
                  value={isAvailable}
                  onChange={handleAvailabitity}
                  label='Is Available'
                  items={[
                    { id: 'yes', title: 'Yes' },
                    { id: 'no', title: 'No' },
                  ]}
                />
                <Divider light />
                <div style={{ marginTop: '15px' }}>
                  <Controls.Button type='submit' text='Update Product' />
                  <Controls.Button
                    text='Reset Form'
                    color='default'
                    onClick={resetForm}
                  />
                </div>
              </Grid>
            </Grid>
          </Form>
          <Dialog open={show} onClose={handleClose}>
            <DialogContent>
              <DialogContentText>
                Are you sure that you want to empty the cart?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color='primary'>
                No
              </Button>
              <Button onClick={confirmDelete} style={{ color: 'red' }}>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>

        <ProductPreview images={images} values={values} />
      </Grid>
    </div>
  );
};

export default ProductEdit;
