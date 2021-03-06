import bodyParser from 'body-parser';
import config from 'config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import logger from 'morgan';
import { getContinuousCounts, getCounts, getPress, getUndo } from './requests';

const API_PORT = 8080;
const app = express();
const router = express.Router();
const dbRoute = config.get('ConnectionString');

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
  const type = req.query.type;

  if (!user || !type) {
    return res.json({
      error: 'INVALID INPUTS\n',
      success: false,
    });
  }
  getPress(
    user,
    type,
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
  const type = req.query.type;
  if (!user || !type) {
    return res.json({
      error: 'INVALID INPUTS\n',
      success: false,
    });
  }
  getCounts(
    user,
    type,
    (total, daily, highscore) => {
      return res.json({
        total,
        daily,
        highscore,
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
  const type = req.query.type;
  if (!user || !type) {
    return res.json({
      error: 'INVALID INPUTS\n',
      success: false,
    });
  }
  getContinuousCounts(
    user,
    type,
    (dailyData, weeklyData) => {
      return res.json({
        dailyData,
        data: weeklyData,
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

router.get('/getUndo', cors(), (req, res) => {
  const user = req.query.user;
  const type = req.query.type;
  if (!user || !type) {
    return res.json({
      error: 'INVALID INPUTS\n',
      success: false,
    });
  }
  getUndo(
    user,
    type,
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

app.use('/api', router);
app.disable('etag');

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}/api`));
