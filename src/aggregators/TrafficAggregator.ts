import { LogQueue } from '@barkbark/parser/LogQueue';
import { Log, TrafficMetricValue, Metric, MetricName, MetricUnit } from '@barkbark/lib';

import { Aggregator } from './Aggregator';

/**
 * Traffic aggregator computing the traffic metric
 *
 */
export class TrafficAggregator extends Aggregator {
  /**
   * TrafficMetric over the Aggregaator timeframe.
   */
  private _metricValue: TrafficMetricValue;

  constructor(logQueue: LogQueue, timeframe: number) {
    super(MetricName.TRAFFIC, logQueue, timeframe, MetricUnit.HIT_PER_SEC);
    this._metricValue = { value: 0, date: 0 };
  }

  /**
   * Compute the traffic
   *
   * @see Aggregator#compute
   */
  public compute = (): void => {
    // We get the logs from the queue, over the aggregator timeframe
    const logs = this._logQueue.getLogsInTimeframe(this._timeframe);
    this._metricValue = this.computeMetricValue(logs);
  };

  /**
   * Compute the traffic for given logs.
   *
   * @param logs the given logs
   */
  public computeMetricValue = (logs: Log[]): TrafficMetricValue => {
    let traffic: number = 0;
    let date: number = 0;
    for (const log of logs) {
      (traffic += 1 / this._timeframe), (date = Math.max(date, log.date));
    }
    return { value: traffic, date };
  };

  public getMetric = (): Metric => ({
    metricName: MetricName.TRAFFIC,
    timeframe: this._timeframe,
    unit: this._unit,
    metricValue: this._metricValue
  });
}
