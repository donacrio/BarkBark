import { Log } from '@barkbark/types';
import { LogQueue } from '@barkbark/LogQueue';

import { AggregatorName } from './types';
import { Aggregator } from './Aggregator';

export class TrafficAggregator extends Aggregator {
  constructor(logQueue: LogQueue, timeframe: number) {
    super(AggregatorName.TRAFFIC, logQueue, timeframe);
  }

  compute = (): void => {
    const logs = this._logQueue.getLogsInTimeframe(this._timeframe);
    console.log(this.computeTrafficMap(logs));
  };

  computeTrafficMap = (logs: Log[]): Map<string, number> => {
    const trafficMap: Map<string, number> = new Map();
    for (const log of logs) {
      const trafficForHost = trafficMap.has(log.remotehost) ? trafficMap.get(log.remotehost)! : 0;
      trafficMap.set(log.remotehost, trafficForHost + 1000 / this._timeframe);
    }
    return trafficMap;
  };
}
