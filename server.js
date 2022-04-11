const express = require('express');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

require('./Config/passport');

const authenticateRouter = require('./Routes/authenticateRoutes');
const userRouter = require('./Routes/userRoutes');
const postRouter = require('./Routes/postRoutes');
const adminRoutes = require('./Routes/adminRoutes');

const { loggerMiddleware } = require('./Middleware/loggerMiddleware');

mongoose.connect('mongodb://localhost:27017/watchlist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('Database Connected');
});

const app = express();

app.use(loggerMiddleware);
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;

var path = require('path');
const logError = require('./Middleware/Error/logError');
const clientErrorHandler = require('./Middleware/Error/clientErrorHandler');
const refDataRouter = require('./Routes/refDataRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api/authenticate', authenticateRouter);
app.use('/api/profile', userRouter);
app.use('/api/post', postRouter);
app.use('/api/refData', refDataRouter);

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(logError);
app.use(clientErrorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

const io = socketIo(server, {
  cors: {
    origins: ['https://localhost:4200'],
    methods: ['GET', 'POST'],
  },
});
app.set('io', io);

io.on('connection', (socket) => {
  console.log('a user connected');
});
