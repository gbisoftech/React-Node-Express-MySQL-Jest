require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorHandler');
const { connectDB } = require('./config/database');
const routes = require('./routes');


const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
module.exports = app;
if(process.env.Node_ENV !== 'test'){
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
}


