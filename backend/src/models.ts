export interface IDailyPresses {
  user: string;
  count: number;
  date: Date;
  hourly: { [key: string]: number };
}

export interface ITotalPresses {
  user: string;
  count: number;
}
