import { LogQueue } from '@barkbark/LogQueue';

import { AggregatorName } from '../lib/types';

export abstract class Aggregator {
  protected _name: AggregatorName;
  protected _logQueue: LogQueue;
  protected _timeframe: number;

  constructor(name: AggregatorName, logQueue: LogQueue, timeframe: number) {
    this._name = name;
    this._logQueue = logQueue;
    this._timeframe = timeframe;
  }

  public abstract compute(): void;
  public abstract getPrintableMetricsMap(): Map<string, string>;

  public getName = (): AggregatorName => this._name;
  public getTimeframe = (): number => this._timeframe;
}
