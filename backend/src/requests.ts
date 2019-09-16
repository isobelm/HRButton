import { DateTime } from 'luxon';
import { DailyPresses, TotalPresses } from './data';

export const getPress = async (user: string, type: string, callback: any, error: any) => {
  try {
    let time = DateTime.local().setZone('Europe/Dublin');
    if (!time.isValid) {
      time = DateTime.local().setZone('UTC+1');
    }
    const today = time.toISODate();
    let dailyPresses = await DailyPresses.findOne({ user, date: today, type });
    let totalPresses = await TotalPresses.findOne({ user, type });

    if (!totalPresses) {
      totalPresses = new TotalPresses({ user, count: 1, type, highscore: 1 });
      if (!dailyPresses) {
        dailyPresses = new DailyPresses({
          user,
          date: today,
          count: 1,
          type,
          hourly: new Map<string, number>(),
          startHighscore: 1,
        });
        dailyPresses.hourly.set(`${time.hour}`, 1);
        await dailyPresses.save();
      } else {
        dailyPresses.count = +dailyPresses.count + 1;
        if (dailyPresses.hourly && dailyPresses.hourly.get(`${time.hour}`)) {
          dailyPresses.hourly.set(`${time.hour}`, dailyPresses.hourly.get(`${time.hour}`) + 1);
        } else {
          if (!dailyPresses.hourly) {
            dailyPresses.hourly = new Map<string, number>();
          }
          dailyPresses.hourly.set(`${time.hour}`, 1);
        }
        await dailyPresses.save();
      }
      totalPresses.highscore = dailyPresses.count;
      await totalPresses.save();
      callback();
    } else {
      totalPresses.count = +totalPresses.count + 1;
      if (!dailyPresses) {
        dailyPresses = new DailyPresses({
          user,
          date: today,
          count: 1,
          type,
          hourly: new Map<string, number>(),
          startHighscore: totalPresses.highscore,
        });
        dailyPresses.hourly.set(`${time.hour}`, 1);
        await dailyPresses.save();
      } else {
        dailyPresses.count = +dailyPresses.count + 1;
        if (dailyPresses.hourly && dailyPresses.hourly.get(`${time.hour}`)) {
          dailyPresses.hourly.set(`${time.hour}`, dailyPresses.hourly.get(`${time.hour}`) + 1);
        } else {
          if (!dailyPresses.hourly) {
            dailyPresses.hourly = new Map<string, number>();
          }
          dailyPresses.hourly.set(`${time.hour}`, 1);
        }
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

export const getCounts = async (user: string, type: string, callback: any, error: any) => {
  try {
    let time = DateTime.local().setZone('Europe/Dublin');
    if (!time.isValid) {
      time = DateTime.local().setZone('UTC+1');
    }
    const today = time.toISODate();
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

export const getContinuousCounts = async (user: string, type: string, callback: any, error: any) => {
  try {
    let time = DateTime.local().setZone('Europe/Dublin');
    if (!time.isValid) {
      time = DateTime.local().setZone('UTC+1');
    }
    let day = time.toISODate();
    let dailyPresses = await DailyPresses.findOne({ user, type, date: day });

    const dailyData = new Array(24).fill(0);
    if (dailyPresses && dailyPresses.hourly) {
      dailyPresses.hourly.forEach((count, hour) => {
        dailyData[+hour] = count;
      });
    }

    const weeklyData = new Array(14);

    for (let i = 0; i < 14; i++) {
      day = time.toISODate();
      dailyPresses = await DailyPresses.findOne({ user, type, date: day });
      if (!dailyPresses) {
        weeklyData[13 - i] = 0;
      } else {
        weeklyData[13 - i] = +dailyPresses.count;
      }
      time = time.minus({ days: 1 });
    }
    callback(dailyData, weeklyData);
  } catch (e) {
    error();
  }
};

export const getUndo = async (user: string, type: string, callback: any, error: any) => {
  try {
    let time = DateTime.local().setZone('Europe/Dublin');
    if (!time.isValid) {
      time = DateTime.local().setZone('UTC+1');
    }
    const day = time.toISODate();
    const dailyPresses = await DailyPresses.findOne({ user, type, date: day });
    const totalPresses = await TotalPresses.findOne({ user, type });

    if (dailyPresses && dailyPresses.hourly && dailyPresses.hourly.get(`${time.hour}`) > 0) {
      dailyPresses.hourly.set(`${time.hour}`, dailyPresses.hourly.get(`${time.hour}`) - 1);
      dailyPresses.count--;

      if (totalPresses) {
        if (dailyPresses.count + 1 >= totalPresses.highscore) {
          totalPresses.highscore = dailyPresses.count;
        } else {
          totalPresses.highscore = dailyPresses.startHighscore;
        }
        totalPresses.count--;
      }
    } else if (dailyPresses && !dailyPresses.hourly) {
      dailyPresses.count--;
    }

    dailyPresses.save();
    totalPresses.save();

    callback();
  } catch (e) {
    error();
  }
};
