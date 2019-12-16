import { LogQueue } from '@barkbark/parser/LogQueue';

import { AggregatorName, AggregatorUnit } from '../lib/types';

/**
 * Aggregator abstract class.
 *
 * This class is used to compute a specific metric over the Aggregator timeframe
 * for every encountered hostname.
 */
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

  /**
   * Compute a metric for every hostname,
   * over logs in the Aggregator queue,
   * over the Aggregator timeframe.
   *
   * The metric depends of the class extending Aggregator abstract class
   */
  public abstract compute(): void;

  /**
   * Return a Map mapping every hostname with its metric value.
   *
   * The metric  value is formated as a string to be printable and displayable in the UI.
   * @returns printable metrics map
   */
  public abstract getPrintableMetricsMap(): Map<string, string>;

  public getName = (): AggregatorName => this._name;
  public getTimeframe = (): number => this._timeframe;
  public getUnit = (): AggregatorUnit => this._unit;
}
