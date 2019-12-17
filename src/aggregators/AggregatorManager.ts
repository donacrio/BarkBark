import { LogQueue } from '@barkbark/parser';
import { Metric, MetricName } from '@barkbark/lib';

import { Aggregator } from './Aggregator';
import { TrafficAggregator } from './TrafficAggregator';
import { SectionTrafficAggregator } from './SectionTrafficAggregator';
import { ResponseCodeAggregator } from './ResponseCodeAggregator';

/**
 * Main class containing the logic for metric computing.
 *
 * It uses an observer pattern with an array of Aggregator instances to compute metrics.
 * The metrics are computed over a LogQueue instance containing the logs.
 * The aggregators are created using a Factory pattern to ensure encapsulation of the logic.
 * @see Aggregator
 */
export class AggregatorManager {
  private _logQueue: LogQueue;
  private _aggregators: Aggregator[];
  private _refreshTime: number;

  constructor(logQueue: LogQueue, refreshTime: number) {
    this._logQueue = logQueue;
    this._aggregators = [];
    this._refreshTime = refreshTime;
  }

  /**
   * Call the compute method of every aggregator to compute the metrics.
   */
  public compute = (): void => {
    this._aggregators.forEach(aggregator => aggregator.compute());
  };

  public addAggregator = (aggregator: Aggregator): void => {
    this._aggregators.push(aggregator);
  };

  /**
   * Return a new Aggregator with a given name and a given timeframe.
   *
   * @param metricName the given name (=instance name)
   * @param timeframe the given timeframe
   * @returns the newly created aggregator instance AS a Aggregator object
   */
  public getAggregator = (metricName: MetricName, timeframe: number): Aggregator => {
    switch (metricName) {
      case MetricName.SECTIONS:
        return new SectionTrafficAggregator(this._logQueue, timeframe);
      case MetricName.TRAFFIC:
        return new TrafficAggregator(this._logQueue, timeframe);
      case MetricName.RESPONSE_CODES:
        return new ResponseCodeAggregator(this._logQueue, timeframe);
      default:
        throw new Error(`Aggregator ${metricName} not yet implemented`);
    }
  };

  public getAggregatorMetrics = (): Metric[] => this._aggregators.map(aggregator => aggregator.getMetric());

  public getRefreshTime = (): number => this._refreshTime;
}
