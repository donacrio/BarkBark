import { LogQueue } from '@barkbark/parser/LogQueue';
import { formatHitsPerSecond, Log, AggregatorName, AggregatorUnit } from '@barkbark/lib';

import { Aggregator } from './Aggregator';

export type TrafficMetric = {
  value: number;
  date: number;
};

/**
 * Traffic aggregator computing the traffic for every host.
 */
export class TrafficAggregator extends Aggregator {
  /**
   * Traffic Map mapping every hostname to its TrafficMetric over the Aggregaator timeframe.
   */
  private _trafficMap: Map<string, TrafficMetric>;

  constructor(logQueue: LogQueue, timeframe: number) {
    super(AggregatorName.TRAFFIC, logQueue, timeframe, AggregatorUnit.HIT_PER_SEC);
    this._trafficMap = new Map();
  }

  /**
   * Compute the traffic for every host.
   *
   * @see Aggregator#compute
   */
  public compute = (): void => {
    // We get the logs from the queue, over the aggregator timeframe
    const logs = this._logQueue.getLogsInTimeframe(this._timeframe);
    this._trafficMap = this.computeTrafficMap(logs);
  };

  /**
   * Return a Map mapping every hostname with its traffic value as a string.
   *
   * @see Aggregator#getPrintableMetricsMap
   */
  public getPrintableMetricsMap = (): Map<string, string> => {
    const printableMetricsMap: Map<string, string> = new Map();
    for (const hostname of this._trafficMap.keys()) {
      const traffic = this._trafficMap.get(hostname)!;
      printableMetricsMap.set(hostname, `${formatHitsPerSecond(traffic.value)}`);
    }
    return printableMetricsMap;
  };

  /**
   * Compute the traffic for every host for given logs.
   *
   * @param logs the given logs
   */
  public computeTrafficMap = (logs: Log[]): Map<string, TrafficMetric> => {
    const trafficMap: Map<string, TrafficMetric> = new Map();
    for (const log of logs) {
      // We get the traffic computed so far for the log's hostname
      const trafficForHost: TrafficMetric = trafficMap.has(log.remotehost)
        ? trafficMap.get(log.remotehost)!
        : { value: 0, date: 0 };
      // We update the traffic with the new log
      trafficMap.set(log.remotehost, {
        value: trafficForHost.value + 1 / this._timeframe,
        date: Math.max(trafficForHost.date, log.date)
      });
    }
    return trafficMap;
  };

  public getTrafficMap = (): Map<string, TrafficMetric> => this._trafficMap;
}
