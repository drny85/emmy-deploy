import { Button } from '@material-ui/core';
import React from 'react';

import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  return (
    <div className='product_card_container'>
      <div
        className='product_card_image'
        style={{ backgroundImage: `url(${product.imageUrl})` }}
      ></div>
      <div className='product_card_body'>
        <div className='price_title'>
          <p>{product.name}</p>
          <p>${product.price}</p>
        </div>
        <div className='product_card_body_description'>
          <p>{product.description}</p>
        </div>
      </div>
      <div className='product_card_footer'>
        <Button variant='contained' onClick={onClick} color='primary'>
          View Details
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
