import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';

const AdminRoutes = ({ component: Component, location, ...rest }) => {
  const { user, loading } = useSelector((state) => state.userData);

  return (
    <Route
      {...rest}
      render={(props) =>
        user && user.isAdmin && !loading ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        )
      }
    />
  );
};

export default AdminRoutes;
