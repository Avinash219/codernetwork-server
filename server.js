const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

require('./Config/passport');

const authenticateRouter = require('./Routes/authenticateRoutes');

mongoose.connect('mongodb://localhost:27017/travelblog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('Database Connected');
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;

var path = require('path');

app.use('/authenticate', authenticateRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
