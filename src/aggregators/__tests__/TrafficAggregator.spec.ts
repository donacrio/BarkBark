import { LogQueue } from '@barkbark/LogQueue';

import { TrafficAggregator } from '../TrafficAggregator';

const FAKE_HOSTS = ['host1', 'host2', 'host3'];
const N_REQUESTS_PER_HOST = 200;

describe('Test TrafficAggregator.ts', () => {
  let logQueue: LogQueue;
  let trafficAggregator: TrafficAggregator;

  beforeEach(() => {
    logQueue = new LogQueue(1000);
    trafficAggregator = new TrafficAggregator(logQueue, 10000);
    for (let i = 0; i < N_REQUESTS_PER_HOST; i++) {
      for (const host of FAKE_HOSTS) {
        logQueue.enqueue({
          remotehost: host,
          rfc931: '-',
          authuser: 'apache',
          date: 100 * i,
          request: 'fake request',
          status: 200,
          bytes: 0
        });
      }
    }
  });

  it('should compute traffic for 10s timeframe', () => {
    const logs = logQueue.getLogsInTimeframe(trafficAggregator.getTimeframe());
    const trafficMap = trafficAggregator.computeTrafficMap(logs);
    for (const host of FAKE_HOSTS) {
      expect(trafficMap.has(host)).toBeTruthy();
      expect(Math.round(trafficMap.get(host)!)).toEqual(10);
    }
  });
  it('should compute without any error', () => {
    expect(() => trafficAggregator.compute()).not.toThrowError();
  });
});