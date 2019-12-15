import { AggregatorName } from './types';
import { Aggregator } from './Aggregator';
import { Queue } from '@barkbark/Queue';
import { Log } from '@barkbark/types';

export class TrafficAggregator extends Aggregator {
  constructor(queue: Queue<Log>, timeframe: number) {
    super(AggregatorName.TRAFFIC, queue, timeframe);
  }

  compute = (): void => {
    const logs = this._getLogsInTimeframe();
    const trafficMap: Map<string, number> = new Map();
    for (const log of logs) {
      const trafficForHost = trafficMap.has(log.remotehost) ? trafficMap.get(log.remotehost)! : 0;
      trafficMap.set(log.remotehost, trafficForHost + 1000 / this._timeframe);
    }
    console.log(trafficMap);
  };
}
