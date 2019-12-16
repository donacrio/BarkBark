import path from 'path';
import { Parser } from '@barkbark/Parser';
import { LogQueue } from '@barkbark/LogQueue';

const SAMPLE_TEST_FILEPATH = path.join(__dirname, 'sample_test.csv');
const SAMPLE_TEST_MALFORMED_FILEPATH = path.join(__dirname, 'sample_test_malformed.csv');

describe('Test Parser.ts', () => {
  let logQueue: LogQueue;
  let parser: Parser;

  beforeEach(() => {
    logQueue = new LogQueue(10);
  });

  it('should read the next line', () => {
    parser = new Parser(SAMPLE_TEST_FILEPATH, logQueue, 1);
    parser.readLine();
    expect(logQueue.getLastElements(10).length).toEqual(1);
  });

  it('should read contigous lines line', () => {
    parser = new Parser(SAMPLE_TEST_FILEPATH, logQueue, 1);
    parser.readLine();
    parser.readLine();
    expect(logQueue.getLastElements(10).length).toEqual(2);
  });

  it('should read only correct lines', () => {
    parser = new Parser(SAMPLE_TEST_MALFORMED_FILEPATH, logQueue, 1);
    for (let i = 0; i < 10; i++) {
      parser.readLine();
    }
    expect(logQueue.getLastElements(10).length).toEqual(1);
  });
});
