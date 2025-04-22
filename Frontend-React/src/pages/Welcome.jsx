import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@mui/material';

const Welcome = () => {
  return (
    <Container maxWidth='xs'>
      <div className="welcome-content">
        <h1>Welcome to Our App</h1>
        <p className="welcome-text">
          Get started with our amazing features and services. Join our community today!
        </p>

      </div>
    </Container >
  );
};

export default Welcome; 