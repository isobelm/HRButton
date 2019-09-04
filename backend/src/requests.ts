import { DateTime } from 'luxon';
import { DailyPresses, TotalPresses } from './data';

DateTime.local().setZone('utc');

export const postUserPress = async (user: string, callback: any, error: any) => {
  try {
    const today = DateTime.local().toISODate();
    const dailyPressesRet = await DailyPresses.findOne({ user, date: today });
    const totalPressesRet = await TotalPresses.findOne({ user });

    if (!totalPressesRet) {
      const totalPresses = new TotalPresses({ user, count: 1 });
      await totalPresses.save();
      if (!dailyPressesRet) {
        const dailyPresses = new DailyPresses({ user, date: today, count: 1 });
        await dailyPresses.save();
      } else {
        dailyPressesRet.count = +dailyPressesRet.count + 1;
        await dailyPressesRet.save();
      }
      callback();
    } else {
      totalPressesRet.count = +totalPressesRet.count + 1;
      totalPressesRet.save();
      if (!dailyPressesRet) {
        const dailyPresses = new DailyPresses({ user, date: today, count: 1 });
        await dailyPresses.save();
      } else {
        dailyPressesRet.count = +dailyPressesRet.count + 1;
        await dailyPressesRet.save();
      }
      callback();
    }
  } catch (e) {
    error();
  }
};

export const getUserCounts = async (user: string, callback: any, error: any) => {
  try {
    const today = DateTime.local().toISODate();
    const dailyPressesRet = await DailyPresses.findOne({ user, date: today });
    const totalPressesRet = await TotalPresses.findOne({ user });

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

export const getUserDailyCounts = async (user: string, callback: any, error: any) => {
  try {
    let dateTime = DateTime.local();
    const data = new Array(14);

    for (let i = 0; i < 14; i++) {
      const day = dateTime.toISODate();
      const dailyPressesRet = await DailyPresses.findOne({ user, date: day });
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
