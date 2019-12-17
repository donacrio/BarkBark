import path from 'path';
import { LogSimulator } from '@barkbark/LogSimulator';

const REGEX_PATTERN = /^"(?<remotehost>\S*)","(?<rfc931>\S*)","(?<authuser>\S*)",(?<date>\d*),"(?<request>.*)",(?<status>\d*),(?<bytes>\d*)$/g;

describe('Test LogSimulator.ts', () => {
  let logSimulator: LogSimulator;

  beforeEach(() => {
    logSimulator = new LogSimulator(path.join(__dirname, 'logs_test.csv'));
    REGEX_PATTERN.lastIndex = 0;
  });

  it('should generate a valid log lines', () => {
    for (let i = 0; i < 10; i++) {
      REGEX_PATTERN.lastIndex = 0;
      const line = logSimulator.generateLogLine();
      const match = REGEX_PATTERN.exec(line);
      expect(match).not.toBeNull();
    }
  });

  it('should write one line without error', () => {
    for (let i = 0; i < 10; i++) {
      const line = logSimulator.generateLogLine();
      expect(() => logSimulator.writeLogLine(line)).not.toThrowError();
    }
  });
});
