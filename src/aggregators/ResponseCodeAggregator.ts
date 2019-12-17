import { LogQueue } from '@barkbark/parser/LogQueue';
import { Log, TrafficMetricValue, Metric, MetricName, MetricUnit, ResponseCodeMetricValue } from '@barkbark/lib';

import { Aggregator } from './Aggregator';

/**
 * Response codes aggregator computing the traffic metric
 *
 */
export class ResponseCodeAggregator extends Aggregator {
  /**
   * ResponseCodeMetric over the Aggregaator timeframe.
   */
  private _metricValue: ResponseCodeMetricValue;

  constructor(logQueue: LogQueue, timeframe: number) {
    super(MetricName.TRAFFIC, logQueue, timeframe, MetricUnit.NUMBER);
    this._metricValue = new Map();
  }

  /**
   * Compute the encountered response codes.
   *
   * @see Aggregator#compute
   */
  public compute = (): void => {
    // We get the logs from the queue, over the aggregator timeframe
    const logs = this._logQueue.getLogsInTimeframe(this._timeframe);
    this._metricValue = this.computeMetricValue(logs);
  };

  /**
   * Compute the response codes for given logs.
   *
   * @param logs the given logs
   */
  public computeMetricValue = (logs: Log[]): ResponseCodeMetricValue => {
    const respondeCodesMap: Map<number, TrafficMetricValue> = new Map();
    let date: number = 0;
    for (const log of logs) {
      const responseCodeInfo = respondeCodesMap.has(log.status)
        ? respondeCodesMap.get(log.status)!
        : { value: 0, date: 0 };
      respondeCodesMap.set(log.status, {
        value: responseCodeInfo.value + 1,
        date: Math.max(responseCodeInfo.date, log.date)
      });
    }
    return respondeCodesMap;
  };

  public getMetric = (): Metric => ({
    metricName: MetricName.RESPONSE_CODES,
    timeframe: this._timeframe,
    unit: this._unit,
    metricValue: this._metricValue
  });
}
