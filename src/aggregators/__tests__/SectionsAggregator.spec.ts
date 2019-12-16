import { LogQueue } from '@barkbark/LogQueue';

import { SectionTrafficAggregator } from '../SectionTrafficAggregator';

const FAKE_SECTIONS = ['/api/user', '/api/dog', '/report'];
const N_REQUESTS_PER_HOST = 200;

describe('Test SectionsAggregator.ts', () => {
  let logQueue: LogQueue;
  let sectionsAggregator: SectionTrafficAggregator;

  beforeEach(() => {
    logQueue = new LogQueue(1000);
    sectionsAggregator = new SectionTrafficAggregator(logQueue, 10000);
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
    const sectionsMap = sectionsAggregator.computeSectionTrafficMap(logs);
    expect(sectionsMap.has('host')).toBeTruthy();
    const hostSectionsMap = sectionsMap.get('host')!;
    expect(hostSectionsMap.has('api')).toBeTruthy();
    expect(Math.round(hostSectionsMap.get('api')!.value)).toEqual(N_REQUESTS_PER_HOST / 10);
    expect(hostSectionsMap.get('api')!.date).toEqual((N_REQUESTS_PER_HOST - 1) * 100);
    expect(hostSectionsMap.has('report')).toBeTruthy();
    expect(Math.round(hostSectionsMap.get('report')!.value)).toEqual(N_REQUESTS_PER_HOST / 20);
    expect(hostSectionsMap.get('report')!.date).toEqual((N_REQUESTS_PER_HOST - 1) * 100);
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
    const sectionsMap = sectionsAggregator.computeSectionTrafficMap(logs);
    expect(sectionsMap.has('host')).toBeFalsy();
  });

  it('should compute without any error', () => {
    expect(() => sectionsAggregator.compute()).not.toThrowError();
  });
});
