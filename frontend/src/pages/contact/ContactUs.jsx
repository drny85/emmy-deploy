import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { EmailOutlined } from '@material-ui/icons';
import axios from '../../utils/axios';

import Controls from '../../components/controls/Controls';
import { Form, useForm } from '../../components/useForm';
import { getCategories } from '../../reduxStore/actions/categoryActions';
import { getProducts } from '../../reduxStore/actions/products';
import Message from '../../components/Message';
import responseError from '../../utils/responseError';

const initialValues = {
  email: '',
  subject: '',
  emailBody: '',
};

const ContactUs = () => {
  const { user } = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState('');
  const [choices, setChioces] = useState([]);
  const { products } = useSelector((state) => state.productsData);
  const { categories } = useSelector((state) => state.categoriesData);

  const { values, handleInputChange, setValues } = useForm(
    initialValues,
    false,
    null
  );

  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setSubject(value);
  };
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
  };

  const handleProductChange = (e) => {
    const value = e.target.value;
    setProduct(value);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    console.log(values.email, values.emailBody);
    if (values.emailBody === '' || values.email === '') {
      setError('email and email body are required');
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }

    try {
      const msg = {
        to: 'emmydashartsy@gmail.com',
        from: values.email,
        subject: subject,
        body: { message: values.emailBody, product: product },
      };

      const { data } = await axios.post('/api/email', msg);
      console.log(data);
    } catch (error) {
      console.error(responseError(error));
    }
  };

  useEffect(() => {
    if (user) {
      setValues({ ...values, email: user.email });
    }
    if (subject === 'product') {
      dispatch(getCategories());
      dispatch(getProducts());
    }
    if (products) {
      setChioces([...products.filter((p) => p.category._id === category)]);
    }
    return () => {};
  }, [user, subject, category]);
  return (
    <div
      style={{
        display: 'flex',
        alignContent: 'space-around',
        flexDirection: 'column',
        maxWidth: '1200px',
        alignItems: 'center',
        margin: 'auto',
        width: '90vw',
      }}
    >
      <h3>Contact Us</h3>
      <Form onSubmit={sendEmail} style={{ width: '80%' }}>
        {error && <Message type="error">{error}</Message>}
        <Controls.Input
          name="email"
          value={values.email}
          type="email"
          label="Email Address"
          onChange={handleInputChange}
        />
        <Controls.Select
          name="subject"
          onChange={handleSubjectChange}
          value={subject}
          label="Select a Subject"
          inputProps={{ style: { textTransform: 'capitalize' } }}
          options={[
            { id: 'general', name: 'general' },
            { id: 'product', name: 'product' },
          ]}
        />
        {subject === 'product' && (
          <Controls.Select
            name="category"
            onChange={handleCategoryChange}
            value={category}
            label="Select a Category"
            inputProps={{ style: { textTransform: 'capitalize' } }}
            options={categories}
          />
        )}
        {category && (
          <Controls.Select
            name="product"
            onChange={handleProductChange}
            value={product}
            label="Select a Product"
            inputProps={{ style: { textTransform: 'capitalize' } }}
            options={[
              ...choices
                .filter((pro) => pro.category._id === category)
                .map((p) => ({ _id: p._id, name: p.name })),
            ]}
          />
        )}
        {product && category && (
          <p style={{ color: 'gray', padding: '5px 12px' }}>
            Note: you are writing to us becuase you have a question about{' '}
            {choices.find((p) => p._id === product).name}
          </p>
        )}

        <Controls.Input
          name="emailBody"
          multiline
          label="Email Body"
          placeholder="Please provide as much details about your question."
          value={values.emailBody}
          onChange={handleInputChange}
        />
        <Button
          style={{ marginLeft: '10px' }}
          variant="outlined"
          type="submit"
          color="primary"
          endIcon={<EmailOutlined />}
        >
          Send Email
        </Button>
      </Form>
    </div>
  );
};

export default ContactUs;
