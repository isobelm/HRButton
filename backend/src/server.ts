import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import logger from 'morgan';
import { getUserCounts, getUserDailyCounts, postUserPress } from './requests';

const API_PORT = 8080;
const app = express();
const router = express.Router();
const dbRoute =
  'mongodb://hrstorage:GF268faDz1ZmDISaVfOArbJHW0LCZGnDApZNoYufFlDy2pqcsT9XNCWtMs3SLYCf25Xs64Cks4PyyZ1NbywtzQ==@hrstorage.documents.azure.com:10255/Storage?ssl=true&replicaSet=globaldb';

app.use(cors());

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true },
);

const db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

router.get('/getPress', cors(), (req, res) => {
  const user = req.query.user;
  if (!user) {
    return res.json({
      error: 'INVALID INPUTS\n',
      success: false,
    });
  }
  postUserPress(
    user,
    () => {
      return res.json({
        success: true,
      });
    },
    () => {
      return res.json({
        success: false,
      });
    },
  );
});

router.get('/getCounts', cors(), (req, res) => {
  const user = req.query.user;
  if (!user) {
    return res.json({
      error: 'INVALID INPUTS\n',
      success: false,
    });
  }
  getUserCounts(
    user,
    (total, daily) => {
      return res.json({
        total,
        daily,
        success: true,
      });
    },
    () => {
      return res.json({
        success: false,
      });
    },
  );
});

router.get('/getDailyCounts', cors(), (req, res) => {
  const user = req.query.user;
  if (!user) {
    return res.json({
      error: 'INVALID INPUTS\n',
      success: false,
    });
  }
  getUserDailyCounts(
    user,
    data => {
      return res.json({
        data,
        success: true,
      });
    },
    () => {
      return res.json({
        success: false,
      });
    },
  );
});

app.use('/api', router);
app.disable('etag');

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}/api`));
