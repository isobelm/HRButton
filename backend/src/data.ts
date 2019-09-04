import { Document, Model, model, Schema } from 'mongoose';
import { IDailyPresses, ITotalPresses } from './models';

export interface IDailyPressesData extends Document, IDailyPresses {}

const groups = new Schema({
  count: String,
  date: Date,
  user: String,
});

export interface ITotalPressesData extends Document, ITotalPresses {}

const users = new Schema({
  count: String,
  user: String,
});

export const DailyPresses: Model<IDailyPressesData> = model<IDailyPressesData>('DailyPresses', groups);
export const TotalPresses: Model<ITotalPressesData> = model<ITotalPressesData>('TotalPresses', users);
