import { Log } from '@barkbark/types';
import { LogQueue } from '@barkbark/LogQueue';

import { AggregatorName } from './types';
import { Aggregator } from './Aggregator';

export type Traffic = {
  value: number;
  date: number;
};

export class TrafficAggregator extends Aggregator {
  private _trafficMap: Map<string, Traffic>;

  constructor(logQueue: LogQueue, timeframe: number) {
    super(AggregatorName.TRAFFIC, logQueue, timeframe);
    this._trafficMap = new Map();
  }

  public compute = (): void => {
    const logs = this._logQueue.getLogsInTimeframe(this._timeframe);
    this._trafficMap = this.computeTrafficMap(logs);
  };

  public computeTrafficMap = (logs: Log[]): Map<string, Traffic> => {
    const trafficMap: Map<string, Traffic> = new Map();
    for (const log of logs) {
      const trafficForHost: Traffic = trafficMap.has(log.remotehost)
        ? trafficMap.get(log.remotehost)!
        : { value: 0, date: 0 };
      trafficMap.set(log.remotehost, {
        value: trafficForHost.value + 1 / this._timeframe,
        date: Math.max(trafficForHost.date, log.date)
      });
    }
    return trafficMap;
  };

  public getTrafficMap = (): Map<string, Traffic> => this._trafficMap;
}
