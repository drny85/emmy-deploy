import { Grid, Button, Paper } from '@material-ui/core';
import React from 'react';

import '../components/cards/ProductCard.css';

const ProductPreview = ({ images, values }) => {
  return (
    <Grid item xs={12} sm={5}>
      <h5 style={{ textAlign: 'center' }}> Preview</h5>
      <div
        className='product_card_container'
        style={{ width: '100%', maxWidth: '100%' }}
      >
        <div
          className='product_card_image'
          style={{
            backgroundImage: `url(${
              images.imageUrl !== ''
                ? images.imageUrl
                : 'https://lunawood.com/wp-content/uploads/2018/02/placeholder-image.png'
            })`,
          }}
        ></div>
        <div className='product_card_body'>
          <div className='price_title'>
            <p>{values.name}</p>
            <p>${values.price}</p>
          </div>
          <div className='product_card_body_description'>
            <p>{values.description}</p>
          </div>
        </div>
        <div className='product_card_footer'>
          <Button variant='contained' disabled color='primary'>
            View Details
          </Button>
        </div>
      </div>
      <Paper
        style={{
          height: '200px',
          padding: '0.5rem',
          marginLeft: '15px',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <h5 style={{ textAlign: 'center' }}>Additional Images</h5>
        {images && (
          <Grid
            container
            style={{
              maxHeight: '180px',
              height: '5rem',
            }}
          >
            <Grid item xs={4}>
              <img
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  borderRadius: '10px',
                  height: '170px',

                  padding: '0.2rem',
                }}
                src={
                  images.image1 !== ''
                    ? images.image1
                    : 'https://lunawood.com/wp-content/uploads/2018/02/placeholder-image.png'
                }
                alt='image1'
              />
            </Grid>
            <Grid item xs={4}>
              <img
                style={{
                  objectFit: 'cover',
                  borderRadius: '10px',
                  width: '100%',
                  height: '170px',

                  padding: '0.2rem',
                }}
                src={
                  images.image2 !== ''
                    ? images.image2
                    : 'https://lunawood.com/wp-content/uploads/2018/02/placeholder-image.png'
                }
                alt='image1'
              />
            </Grid>
            <Grid item xs={4}>
              <img
                style={{
                  objectFit: 'cover',
                  borderRadius: '10px',
                  width: '100%',

                  height: '170px',
                  padding: '0.2rem',
                }}
                src={
                  images.image3 !== ''
                    ? images.image3
                    : 'https://lunawood.com/wp-content/uploads/2018/02/placeholder-image.png'
                }
                alt='image1'
              />
            </Grid>
          </Grid>
        )}
      </Paper>
    </Grid>
  );
};

export default ProductPreview;
