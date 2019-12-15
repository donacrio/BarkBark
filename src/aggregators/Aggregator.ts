import { Queue } from '@barkbark/lib/Queue';
import { Log } from '@barkbark/types';
import { LogQueue } from '@barkbark/LogQueue';

import { AggregatorName } from './types';

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

  public getName = (): AggregatorName => this._name;
  public getTimeframe = (): number => this._timeframe;
}
