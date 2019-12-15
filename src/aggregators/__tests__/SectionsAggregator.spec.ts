import { LogQueue } from '@barkbark/LogQueue';

import { SectionsAggregator } from '../SectionsAggregator';

const FAKE_SECTIONS = ['/api/user', '/api/dog', '/report'];
const N_REQUESTS_PER_HOST = 200;

describe('Test SectionsAggregator.ts', () => {
  let logQueue: LogQueue;
  let sectionsAggregator: SectionsAggregator;

  beforeEach(() => {
    logQueue = new LogQueue(1000);
    sectionsAggregator = new SectionsAggregator(logQueue, 10000);
    for (let i = 0; i < N_REQUESTS_PER_HOST; i++) {
      for (const section of FAKE_SECTIONS) {
        logQueue.enqueue({
          remotehost: 'host',
          rfc931: '-',
          authuser: 'apache',
          date: 100 * i,
          request: `GET ${section} HTTP/1.0`,
          status: 200,
          bytes: 0
        });
      }
    }
  });

  it('should compute sections for 10s timeframe', () => {
    const logs = logQueue.getLogsInTimeframe(sectionsAggregator.getTimeframe());
    const sectionsMap = sectionsAggregator.computeSectionsMap(logs);
    expect(sectionsMap.has('host')).toBeTruthy();
    const hostSectionsMap = sectionsMap.get('host')!;
    expect(hostSectionsMap.has('api')).toBeTruthy();
    expect(Math.round(hostSectionsMap.get('api')!)).toEqual(20);
    expect(hostSectionsMap.has('report')).toBeTruthy();
    expect(Math.round(hostSectionsMap.get('report')!)).toEqual(10);
  });

  it('should not take malformed request into account', () => {
    const logs = [
      {
        remotehost: 'host',
        rfc931: '-',
        authuser: 'apache',
        date: 10,
        request: 'fakeRequest',
        status: 200,
        bytes: 0
      },
      {
        remotehost: 'host',
        rfc931: '-',
        authuser: 'apache',
        date: 10,
        request: 'fake request test',
        status: 200,
        bytes: 0
      }
    ];
    const sectionsMap = sectionsAggregator.computeSectionsMap(logs);
    expect(sectionsMap.has('host')).toBeFalsy();
  });

  it('should compute without any error', () => {
    expect(() => sectionsAggregator.compute()).not.toThrowError();
  });
});
