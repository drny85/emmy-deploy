import React, { useEffect, useState } from 'react';
import { Divider, Grid } from '@material-ui/core';
import Controls from '../controls/Controls';
import { useForm, Form } from '../useForm';
import { addProduct } from '../../reduxStore/actions/products';
import { getCategories } from '../../reduxStore/actions/categoryActions';
import { useDispatch, useSelector } from 'react-redux';

import '../../components/cards/ProductCard.css';

import axios from '../../utils/axios';
import Message from '../Message';
import Loader from '../Loader';

import ProductPreview from '../ProductPreview';

const initialValues = {
  name: '',
  description: '',
  price: '',
  category: '',
  imageUrl: '',
  estimatedDelivery: '',
  available: true,
};

const ProductForm = () => {
  const dispatch = useDispatch();

  const [imageError, setImageError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState({
    imageUrl: '',
    image1: '',
    image2: '',
    image3: '',
  });
  const { error } = useSelector((state) => state.productsData);
  const { categories, loading } = useSelector((state) => state.categoriesData);

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
        fieldValues.category.length !== 0 ? '' : 'This field is required';

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

  const { values, handleInputChange, errors, setErrors, resetForm } = useForm(
    initialValues,
    true,
    validate
  );

  const handleImage = async (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    console.log(name);
    const formData = new FormData();

    formData.append('imageUrl', file);
    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post('/api/upload', formData, config);

      setImages({ ...images, [name]: data });
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    } finally {
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      images.imageUrl === '' ||
      images.image1 === '' ||
      images.image2 === '' ||
      images.image3 === ''
    ) {
      setImageError('All images fields are required');
      return;
    }
    if (validate()) {
      values.imageUrl = images.imageUrl;
      console.log(values);
      dispatch(
        addProduct({
          ...values,
          images: [images.image1, images.image2, images.image3],
        })
      );
      setImages({ imageUrl: '', image1: '', image2: '', image3: '' });

      resetForm();
    }
  };

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className='form_div' style={{ maxWidth: '1280px' }}>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <Form onSubmit={handleSubmit}>
            <Grid container>
              {error ||
                (imageError && (
                  <Message type='error'>{error || imageError}</Message>
                ))}
              <Grid item sx={12} md={12}>
                <Controls.Input
                  name='name'
                  className='capitalize'
                  inputProps={{ style: { textTransform: 'capitalize' } }}
                  value={values.name}
                  error={errors.name}
                  label='Product Name'
                  onChange={handleInputChange}
                />
                <Controls.Input
                  name='description'
                  value={values.description}
                  multiline={true}
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
                  label='Select a category or collection'
                  onChange={handleInputChange}
                  options={categories}
                />
                <label
                  style={{ marginLeft: '10px', fontWeight: 'bold' }}
                  htmlFor='images'
                >
                  Pick Main Image
                </label>
                <Controls.Input
                  name='imageUrl'
                  focused={true}
                  label='Main Image'
                  type='file'
                  inputProps={{ autoFocus: true, disabled: uploading }}
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
                      focused={true}
                      label='Image 1'
                      type='file'
                      inputProps={{
                        autoFocus: true,
                        disabled: uploading,
                        hidden: true,
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
                      inputProps={{ autoFocus: true, disabled: uploading }}
                      onChange={handleImage}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <Controls.Input
                      name='image3'
                      label='Image 3'
                      focused={true}
                      type='file'
                      inputProps={{ autoFocus: true, disabled: uploading }}
                      onChange={handleImage}
                    />
                  </Grid>
                </Grid>

                <Controls.Input
                  name='estimatedDelivery'
                  placeholder='Days delivery might take. Ex. 2'
                  value={values.estimatedDelivery}
                  error={errors.estimatedDelivery}
                  label='Estimated Delivery Days'
                  type='number'
                  onChange={handleInputChange}
                />
                <Divider light />
                <div style={{ marginTop: '15px' }}>
                  <Controls.Button type='submit' text='Add Product' />
                  <Controls.Button
                    text='Reset Form'
                    color='default'
                    onClick={resetForm}
                  />
                </div>
              </Grid>
            </Grid>
          </Form>
        </Grid>
        <ProductPreview values={values} images={images} />
      </Grid>
    </div>
  );
};

export default ProductForm;
