const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./userRoutes');
const articleRoutes = require('./articleRoutes');

// Mount routes
router.use('/auth', userRoutes);
router.use('/articles', articleRoutes);

module.exports = router; 