import { LogQueue } from '@barkbark/parser/LogQueue';

import { TrafficAggregator } from '../TrafficAggregator';

describe('Test TrafficAggregator.ts', () => {
  let logQueue: LogQueue;
  let trafficAggregator: TrafficAggregator;

  beforeEach(() => {
    logQueue = new LogQueue(1000);
    trafficAggregator = new TrafficAggregator(logQueue, 10);
    for (let i = 0; i < 201; i++) {
      logQueue.enqueue({
        rfc931: '-',
        authuser: 'apache',
        date: Math.round(0.1 * i),
        request: 'fake request',
        status: 200,
        bytes: 0
      });
    }
  });

  it('should compute traffic for 10s timeframe', () => {
    const logs = logQueue.getLogsInTimeframe(trafficAggregator.getTimeframe());
    const trafficMetric = trafficAggregator.computeMetricValue(logs);
    expect(Math.round(trafficMetric.value)).toEqual(10);
    expect(trafficMetric.date).toEqual(20);
  });

  it('should compute without any error', () => {
    expect(() => trafficAggregator.compute()).not.toThrowError();
  });
});
