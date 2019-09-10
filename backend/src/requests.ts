import { DateTime } from 'luxon';
import { DailyPresses, TotalPresses } from './data';

DateTime.local().setZone('utc');

export const postUserPress = async (user: string, type: string, callback: any, error: any) => {
  try {
    const today = DateTime.local().toISODate();
    const dailyPressesRet = await DailyPresses.findOne({ user, date: today, type });
    const totalPressesRet = await TotalPresses.findOne({ user, type });

    if (!totalPressesRet) {
      const totalPresses = new TotalPresses({ user, count: 1, type, highscore: 1 });
      if (!dailyPressesRet) {
        const dailyPresses = new DailyPresses({ user, date: today, count: 1, type });
        await dailyPresses.save();
      } else {
        dailyPressesRet.count = +dailyPressesRet.count + 1;
        await dailyPressesRet.save();
      }
      if (dailyPressesRet.count > totalPresses.highscore) {
        totalPresses.highscore = dailyPressesRet.count;
      }
      await totalPresses.save();
      callback();
    } else {
      totalPressesRet.count = +totalPressesRet.count + 1;
      if (!dailyPressesRet) {
        const dailyPresses = new DailyPresses({ user, date: today, count: 1, type });
        await dailyPresses.save();
      } else {
        dailyPressesRet.count = +dailyPressesRet.count + 1;
        await dailyPressesRet.save();
      }
      if (dailyPressesRet.count > totalPressesRet.highscore) {
        totalPressesRet.highscore = dailyPressesRet.count;
      }
      totalPressesRet.save();
      callback();
    }
  } catch (e) {
    error();
  }
};

export const getUserCounts = async (user: string, type: string, callback: any, error: any) => {
  try {
    const today = DateTime.local().toISODate();
    const dailyPressesRet = await DailyPresses.findOne({ user, date: today, type });
    const totalPressesRet = await TotalPresses.findOne({ user, type });

    if (!totalPressesRet) {
      if (!dailyPressesRet) {
        callback(0, 0);
      } else {
        callback(0, +dailyPressesRet.count);
      }
    } else {
      if (!dailyPressesRet) {
        callback(+totalPressesRet.count, 0);
      } else {
        callback(+totalPressesRet.count, +dailyPressesRet.count);
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
      const dailyPressesRet = await DailyPresses.findOne({ user, type, date: day });
      if (!dailyPressesRet) {
        data[13 - i] = 0;
      } else {
        data[13 - i] = +dailyPressesRet.count;
      }
      dateTime = dateTime.minus({ days: 1 });
    }
    callback(data);
  } catch (e) {
    error();
  }
};
