import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
} from '@mui/icons-material';

import ArticleTable from '../components/articles/ArticlesTable';

const Home = () => {


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={1}>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <ArticleTable />
      </Container>
    </Box>
  );
};

export default Home; 