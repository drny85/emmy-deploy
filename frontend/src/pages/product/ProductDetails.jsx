import {
  Card,
  CardMedia,
  Container,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Radio,
  Divider,
  Dialog,
  DialogContent,
  makeStyles,
  DialogTitle,
  DialogActions,
} from '@material-ui/core';
import React, { useState } from 'react';

import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../reduxStore/actions/shoppingCart';
import CartItem from '../../models/CartItem';
import { useEffect } from 'react';
import {
  getProductById,
  resetProduct,
} from '../../reduxStore/actions/products';
import Loader from '../../components/Loader';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  buttonStyle: (props) => {
    return {
      [theme.breakpoints.down('xs')]: { width: '100%' },
    };
  },
}));

const ProductDetails = ({ match, history, full }) => {
  const classes = useStyles({ full });
  const { product } = useSelector((state) => state.productsData);
  const id = match.params.id;
  const [sizeChecked, setChecked] = useState(null);
  const [noSizeSelected, setNoSizeSelected] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (product.sizes) {
      if (sizeChecked === null) {
        setNoSizeSelected(true);
        return;
      }
    }
    const item = new CartItem(product, 1, product.price);

    dispatch(addToCart(item));
    history.push('/cart');
  };

  const handleSizeChange = (e) => {
    setChecked(e.target.value);
  };
  const handleImageClick = (e) => {
    const img = e.target.src;

    setModalImage(img);
    setOpen(true);
  };

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }

    return () => {
      dispatch(resetProduct());
    };
  }, [dispatch, id]);

  if (!product) return <Loader />;

  return (
    <div
      className='product_details animate__animated animate__backInDown'
      style={{ maxWidth: '980px', margin: 'auto' }}
    >
      <Container>
        <h2 style={{ textAlign: 'center', padding: '15px 0px' }}>
          Product Details
        </h2>
        <Paper>
          <Grid container>
            <Grid item sx={12} md={5}>
              <Card>
                <CardMedia
                  className='imgHover'
                  onClick={handleImageClick}
                  component='img'
                  height='400px'
                  style={{ maxHeight: '400px' }}
                  image={product.imageUrl}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <List>
                <ListItem>
                  <Typography
                    style={{ textTransform: 'capitalize' }}
                    variant='h5'
                  >
                    {product.name}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography className='capitalize' variant='body2'>
                    {product.description}
                  </Typography>
                </ListItem>
                <Divider light />
                <ListItem>
                  <ListItemIcon>
                    <LocalShippingIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Estimated Delivery: ${
                      product?.estimatedDelivery === 0
                        ? 'immediately'
                        : product.estimatedDelivery === 1
                        ? product.estimatedDelivery + ' day'
                        : product.estimatedDelivery + ' days'
                    }`}
                  />
                </ListItem>
                <Divider light />
                {product.sizes && (
                  <>
                    <ListItem>
                      <Typography variant='h6'>Select a size:</Typography>
                    </ListItem>
                    <ListItem>
                      {product.sizes.map((size, i) => {
                        return (
                          <div key={i}>
                            <span
                              style={{
                                textTransform: 'capitalize',
                                fontWeight:
                                  size === sizeChecked ? '700' : 'inherit',
                              }}
                            >
                              {size}
                            </span>
                            <Radio
                              value={size}
                              checked={sizeChecked === size}
                              onChange={handleSizeChange}
                            />
                          </div>
                        );
                      })}
                    </ListItem>
                  </>
                )}

                <Divider light />
                <ListItem>
                  <Typography variant='h4'>${product.price}</Typography>
                </ListItem>
                <Divider light />
                <ListItem>
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.available}
                    style={{
                      marginTop: '10px',
                      marginRight: '5px',
                    }}
                    startIcon={<ShoppingCartIcon />}
                    variant='contained'
                    size='large'
                    className={classes.buttonStyle}
                    color='primary'
                  >
                    Add to Cart
                  </Button>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>

        {product.images && product.images.length > 0 && (
          <div className='mainImages'>
            <h4 style={{ textAlign: 'center', margin: '25px 0px' }}>
              Additional Images
            </h4>
            <div className='imagesGrid'>
              {product.images.map((image, i) => {
                return (
                  <div style={{ height: '100%', maxHeight: '12rem' }} key={i}>
                    <img
                      className='imgHover'
                      onClick={handleImageClick}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      src={image}
                      alt='imag'
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Dialog fullWidth onBackdropClick={() => setOpen(false)} open={open}>
          <DialogTitle>
            <IconButton
              aria-label='close'
              className={classes.closeButton}
              onClick={() => {
                setOpen(false);
                setModalImage('');
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent style={{ marginTop: '10px' }}>
            <Card>
              <CardMedia height='600' component='img' image={modalImage} />
            </Card>
          </DialogContent>
        </Dialog>
        <Dialog open={noSizeSelected} fullWidth>
          <DialogTitle>No Size Selected</DialogTitle>
          <DialogContent>
            <Typography variant='body1'>Please select a size</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setNoSizeSelected(false)}
              color='secondary'
              variant='outlined'
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default ProductDetails;
