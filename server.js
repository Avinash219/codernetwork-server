const express = require('express');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

require('./Config/passport');

const authenticateRouter = require('./Routes/authenticateRoutes');
const userRouter = require('./Routes/userRoutes');

const { loggerMiddleware } = require('./Middleware/loggerMiddleware');

console.log(process.env);
if (process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config();
  console.log(process.env.PORT);
}

mongoose.connect(process.env.MONGOOSE_URL, {
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
const questionAnswerRouter = require('./Routes/questionAnswerRoutes');
const tipRouter = require('./Routes/TipRoutes');

app.use('/api/authenticate', authenticateRouter);
app.use('/api/profile', userRouter);
app.use('/api/refData', refDataRouter);
app.use('/api/questionAnswer', questionAnswerRouter);
app.use('/api/tip', tipRouter);

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(logError);
app.use(clientErrorHandler);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
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
