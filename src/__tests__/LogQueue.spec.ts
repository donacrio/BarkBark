import { Log } from '@barkbark/lib';
import { LogQueue } from '@barkbark/parser/LogQueue';

describe('Test LogQueue.ts', () => {
  let logs: Log[];
  let logQueue: LogQueue;

  beforeEach(() => {
    logs = [];
    logQueue = new LogQueue(20);
    for (let i = 0; i < 10; i++) {
      logQueue.enqueue({
        remotehost: 'host',
        rfc931: '-',
        authuser: 'apache',
        date: i,
        request: 'fake request',
        status: 200,
        bytes: 0
      });
    }
    for (let i = 10; i < 20; i++) {
      const log: Log = {
        remotehost: 'host',
        rfc931: '-',
        authuser: 'apache',
        date: i,
        request: 'fake request',
        status: 200,
        bytes: 0
      };
      logs.push(log);
      logQueue.enqueue(log);
    }
  });

  it('should return the logs in the correct timeframe', () => {
    const logsInTimeframe = logQueue.getLogsInTimeframe(10);
    expect(logsInTimeframe).toEqual(logs);
  });
});
