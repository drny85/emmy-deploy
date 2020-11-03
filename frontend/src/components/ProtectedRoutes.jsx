import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';

const ProtectedRoutes = ({ component: Component, location, ...rest }) => {
  const { user, loading } = useSelector((state) => state.userData);

  //if (!user) return <Login />

  return (
    <Route
      {...rest}
      render={(props) =>
        user && user ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        )
      }
    />
  );
};

export default ProtectedRoutes;
