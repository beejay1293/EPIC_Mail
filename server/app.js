import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).json({
  status: 200,
  data: [
    {
      message: 'Welcome to EPIC Mail',
    },
  ],
}));

app.all('*', (req, res) => res.status(404).json({
  status: 404,
  error: 'Route does not exist',
}));

const port = process.env.PORT || 8000;
app.listen(port);
