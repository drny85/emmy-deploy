import { Hidden, Badge } from '@material-ui/core';
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { useSelector } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';

import './NavBar.css';
import { useState } from 'react';

const HamNav = (props) => {
  const input = useRef();
  const theme = useTheme();
  const [bgColor, setBgColor] = useState(false);
  const { quantity } = useSelector((state) => state.cartData);
  const { loading, user } = useSelector((state) => state.userData);

  const checkInput = () => {
    if (input.current.checked) {
      input.current.checked = false;
    }
  };

  const handleBgColor = () => {
    if (input.current.checked) {
      setBgColor(true);
    } else {
      setBgColor(false);
    }
  };

  return (
    <header>
      <div
        style={{ backgroundColor: theme.palette.primary.main }}
        className='menu-wrap'
      >
        <input
          ref={input}
          type='checkbox'
          onChange={handleBgColor}
          className='toggler'
        />

        <div
          style={{
            backgroundColor: bgColor
              ? 'rgba(16, 17, 19, 0.95)'
              : theme.palette.primary.main,
          }}
          className='hamburger'
        >
          <div></div>
        </div>

        <div className='menu'>
          <div>
            <div>
              <ul>
                <li>
                  <Link onClick={checkInput} to='/'>
                    Home
                  </Link>
                </li>
                {user && user.isAdmin && (
                  <li>
                    <Link onClick={checkInput} to='/admin'>
                      Admin
                    </Link>
                  </li>
                )}
                {user && user ? (
                  <li>
                    <Link
                      className='capitalize bold'
                      onClick={checkInput}
                      to='/profile'
                    >
                      {user.name}
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      className='capitalize bold'
                      onClick={checkInput}
                      to='/login'
                    >
                      {'Login'}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className='links'>
          <Hidden mdUp>
            <ul>
              <li style={{ marginRight: 'auto', marginLeft: '70px' }}>
                <Link
                  style={{ fontSize: '1.1rem' }}
                  onClick={checkInput}
                  to='/'
                >
                  Emmy-Dash
                </Link>
              </li>
              <li>
                <Link onClick={checkInput} to='/cart'>
                  {' '}
                  <Badge badgeContent={quantity} color='secondary'>
                    <ShoppingCartIcon />
                  </Badge>
                </Link>
              </li>
            </ul>
          </Hidden>
          <Hidden smDown>
            <ul>
              <li style={{ marginRight: 'auto', marginLeft: '70px' }}>
                <Link onClick={checkInput} to='/'>
                  Emmy-Dash
                </Link>
              </li>
              <li>
                <Link onClick={checkInput} to='/'>
                  Home
                </Link>
              </li>
              {user && user.isAdmin && (
                <li>
                  <Link onClick={checkInput} to='/admin'>
                    Admin
                  </Link>
                </li>
              )}
              {user && user ? (
                <li>
                  <Link
                    className='capitalize bold'
                    onClick={checkInput}
                    to='/profile'
                  >
                    {user.name}
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    className='capitalize bold'
                    onClick={checkInput}
                    to='/login'
                  >
                    {'Login'}
                  </Link>
                </li>
              )}

              <Hidden smDown>
                <li>
                  <Link onClick={checkInput} to='/cart'>
                    {' '}
                    <Badge badgeContent={quantity} color='primary'>
                      <ShoppingCartIcon />
                    </Badge>
                  </Link>
                </li>
              </Hidden>
            </ul>
          </Hidden>
        </div>
      </div>
    </header>
  );
};

export default HamNav;
