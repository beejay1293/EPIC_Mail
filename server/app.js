import express from 'express';
import bodyParser from 'body-parser';
import users from './routes/api/users';
import message from './routes/api/message';
import usersdb from './routes/api/usersdb';
import messagedb from './routes/api/messagedb';
import group from './routes/api/group';

// Initialize express app
const app = express();

// body-parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// Home page route
app.get('/', (req, res) => res.status(200).json({
  status: 200,
  data: [
    {
      message: 'Welcome to EPIC Mail',
    },
  ],
}));

// user routes
app.use('/api/v1/auth', users);

// db user route
app.use('/api/v2/auth', usersdb);

// message route
app.use('/api/v1', message);

// db message route
app.use('/api/v2', messagedb);

// db group route
app.use('/api/v2', group);

// Handle non existing route with with proper message
app.all('*', (req, res) => res.status(404).json({
  status: 404,
  error: 'Route does not exist',
}));

// Define application port number
const port = process.env.PORT || 3000;

// Start server
app.listen(port);

// expose app to be use in another file
export default app;
