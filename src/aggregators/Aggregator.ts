import { LogQueue } from '@barkbark/LogQueue';

import { AggregatorName, AggregatorUnit } from '../lib/types';

export abstract class Aggregator {
  protected _name: AggregatorName;
  protected _logQueue: LogQueue;
  protected _timeframe: number;
  protected _unit: AggregatorUnit;

  constructor(name: AggregatorName, logQueue: LogQueue, timeframe: number, unit: AggregatorUnit) {
    this._name = name;
    this._logQueue = logQueue;
    this._timeframe = timeframe;
    this._unit = unit;
  }

  public abstract compute(): void;
  public abstract getPrintableMetricsMap(): Map<string, string>;

  public getName = (): AggregatorName => this._name;
  public getTimeframe = (): number => this._timeframe;
  public getUnit = (): AggregatorUnit => this._unit;
}
