import React from 'react'
import ProductForm from '../../components/forms/ProductForm'

const AddProduct = () => {
    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px', flexDirection: 'column'}}>
            <h3>Adding a Product</h3>
           <ProductForm /> 
        </div>
    )
}

export default AddProduct
