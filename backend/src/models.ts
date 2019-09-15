export interface IDailyPresses {
  user: string;
  count: number;
  date: Date;
  hourly: Map<string, number>;
  type: string;
}

export interface ITotalPresses {
  user: string;
  count: number;
  highscore: number;
  type: string;
}
