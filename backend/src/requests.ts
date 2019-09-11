import { DateTime } from 'luxon';
import { DailyPresses, TotalPresses } from './data';

DateTime.local().setZone('utc');

export const getUserPress = async (user: string, type: string, callback: any, error: any) => {
  try {
    const today = DateTime.local().toISODate();
    let dailyPresses = await DailyPresses.findOne({ user, date: today, type });
    let totalPresses = await TotalPresses.findOne({ user, type });

    if (!totalPresses) {
      totalPresses = new TotalPresses({ user, count: 1, type, highscore: 1 });
      if (!dailyPresses) {
        dailyPresses = new DailyPresses({ user, date: today, count: 1, type });
        await dailyPresses.save();
      } else {
        dailyPresses.count = +dailyPresses.count + 1;
        await dailyPresses.save();
      }
      totalPresses.highscore = dailyPresses.count;
      await totalPresses.save();
      callback();
    } else {
      totalPresses.count = +totalPresses.count + 1;
      if (!dailyPresses) {
        dailyPresses = new DailyPresses({ user, date: today, count: 1, type });
        await dailyPresses.save();
      } else {
        dailyPresses.count = +dailyPresses.count + 1;
        await dailyPresses.save();
      }
      if (dailyPresses.count > totalPresses.highscore) {
        totalPresses.highscore = dailyPresses.count;
      }
      await totalPresses.save();
      callback();
    }
  } catch (e) {
    error();
  }
};

export const getUserCounts = async (user: string, type: string, callback: any, error: any) => {
  try {
    const today = DateTime.local().toISODate();
    const dailyPresses = await DailyPresses.findOne({ user, date: today, type });
    const totalPresses = await TotalPresses.findOne({ user, type });

    if (!totalPresses) {
      if (!dailyPresses) {
        callback(0, 0, 0);
      } else {
        callback(0, +dailyPresses.count, 0);
      }
    } else {
      if (!dailyPresses) {
        callback(+totalPresses.count, 0, +totalPresses.highscore);
      } else {
        callback(+totalPresses.count, +dailyPresses.count, +totalPresses.highscore);
      }
    }
  } catch (e) {
    error();
  }
};

export const getUserDailyCounts = async (user: string, type: string, callback: any, error: any) => {
  try {
    let dateTime = DateTime.local();
    const data = new Array(14);

    for (let i = 0; i < 14; i++) {
      const day = dateTime.toISODate();
      const dailyPresses = await DailyPresses.findOne({ user, type, date: day });
      if (!dailyPresses) {
        data[13 - i] = 0;
      } else {
        data[13 - i] = +dailyPresses.count;
      }
      dateTime = dateTime.minus({ days: 1 });
    }
    callback(data);
  } catch (e) {
    error();
  }
};
