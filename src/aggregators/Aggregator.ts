import { LogQueue } from '@barkbark/parser/LogQueue';

import { MetricName, MetricUnit, Metric } from '../lib/types';

/**
 * Aggregator abstract class.
 *
 * This class is used to compute a specific metric over the Aggregator timeframe.
 */
export abstract class Aggregator {
  protected _name: MetricName;
  protected _logQueue: LogQueue;
  protected _timeframe: number;
  protected _unit: MetricUnit;

  constructor(name: MetricName, logQueue: LogQueue, timeframe: number, unit: MetricUnit) {
    this._name = name;
    this._logQueue = logQueue;
    this._timeframe = timeframe;
    this._unit = unit;
  }

  /**
   * Compute a metric
   * over logs in the Aggregator queue,
   * over the Aggregator timeframe.
   *
   * The metric depends of the class extending Aggregator abstract class
   */
  public abstract compute(): void;

  /**
   * Get the aggregator metric
   * @returns metric
   */
  public abstract getMetric(): Metric;

  public getName = (): MetricName => this._name;
  public getTimeframe = (): number => this._timeframe;
  public getUnit = (): MetricUnit => this._unit;
}
