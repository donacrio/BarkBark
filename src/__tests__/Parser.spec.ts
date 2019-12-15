import path from 'path';
import { Parser } from '@barkbark/Parser';
import { Queue } from '@barkbark/Queue';
import { Log } from '@barkbark/types';

const SAMPLE_TEST_FILEPATH = path.join(__dirname, 'sample_test.csv');
const SAMPLE_TEST_MALFORMED_FILEPATH = path.join(__dirname, 'sample_test_malformed.csv');

describe('Test Parser.ts', () => {
  let queue: Queue<Log>;
  let parser: Parser;

  beforeEach(() => {
    queue = new Queue(10);
  });

  it('should read the next line', () => {
    parser = new Parser(SAMPLE_TEST_FILEPATH, queue);
    parser.readLine();
    expect(queue.getLastElements(10).length).toEqual(1);
  });

  it('should read contigous lines line', () => {
    parser = new Parser(SAMPLE_TEST_FILEPATH, queue);
    parser.readLine();
    parser.readLine();
    expect(queue.getLastElements(10).length).toEqual(2);
  });

  it('should read only correct lines', () => {
    parser = new Parser(SAMPLE_TEST_MALFORMED_FILEPATH, queue);
    for (let i = 0; i < 10; i++) {
      parser.readLine();
    }
    expect(queue.getLastElements(10).length).toEqual(1);
  });
});
