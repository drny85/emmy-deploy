import React from 'react';

const EmptyPage = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  );
};

export default EmptyPage;
