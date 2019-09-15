import { Document, Model, model, Schema } from 'mongoose';
import { IDailyPresses, ITotalPresses } from './models';

export interface IDailyPressesData extends Document, IDailyPresses {}

const dailyPresses = new Schema({
  count: String,
  date: Date,
  hourly: { type: Map, hour: Number },
  type: String,
  user: String,
});

export interface ITotalPressesData extends Document, ITotalPresses {}

const totalPresses = new Schema({
  count: Number,
  highscore: Number,
  type: String,
  user: String,
});

export const DailyPresses: Model<IDailyPressesData> = model<IDailyPressesData>('DailyPresses', dailyPresses);
export const TotalPresses: Model<ITotalPressesData> = model<ITotalPressesData>('TotalPresses', totalPresses);
