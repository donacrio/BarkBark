import { LogQueue } from '@barkbark/parser/LogQueue';

import { SectionTrafficAggregator } from '../SectionTrafficAggregator';

const FAKE_SECTIONS = ['/api/user', '/api/dog', '/report'];

describe('Test SectionsAggregator.ts', () => {
  let logQueue: LogQueue;
  let sectionsAggregator: SectionTrafficAggregator;

  beforeEach(() => {
    logQueue = new LogQueue(1000);
    sectionsAggregator = new SectionTrafficAggregator(logQueue, 10);
    for (let i = 0; i < 201; i++) {
      for (const section of FAKE_SECTIONS) {
        logQueue.enqueue({
          rfc931: '-',
          authuser: 'apache',
          date: Math.round(0.1 * i),
          request: `GET ${section} HTTP/1.0`,
          status: 200,
          bytes: 0
        });
      }
    }
  });

  it('should compute sections for 10s timeframe', () => {
    const logs = logQueue.getLogsInTimeframe(sectionsAggregator.getTimeframe());
    const metricValue = sectionsAggregator.computeMetricValue(logs);
    expect(metricValue.has('api')).toBeTruthy();
    expect(Math.round(metricValue.get('api')!.value)).toEqual(19);
    expect(metricValue.get('api')!.date).toEqual(20);
    expect(metricValue.has('report')).toBeTruthy();
    expect(Math.round(metricValue.get('report')!.value)).toEqual(10);
    expect(metricValue.get('report')!.date).toEqual(20);
  });

  it('should not take malformed request into account', () => {
    const logs = [
      {
        rfc931: '-',
        authuser: 'apache',
        date: 10,
        request: 'fakeRequest',
        status: 200,
        bytes: 0
      },
      {
        rfc931: '-',
        authuser: 'apache',
        date: 10,
        request: 'fake request test',
        status: 200,
        bytes: 0
      }
    ];
    const metricValue = sectionsAggregator.computeMetricValue(logs);
    expect(Array.from(metricValue.keys()).length).toEqual(0);
  });

  it('should compute without any error', () => {
    expect(() => sectionsAggregator.compute()).not.toThrowError();
  });
});
