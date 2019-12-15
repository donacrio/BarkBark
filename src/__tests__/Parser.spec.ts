import path from 'path';
import { Parser } from '@barkbark/Parser';
import { Queue } from '@barkbark/Queue';
import { Log } from '@barkbark/types';

const SAMPLE_TEST_FILEPATH = path.join(__dirname, 'sample_test.csv');
describe('Test Parser.ts', () => {
  let queue: Queue<Log>;
  let parser: Parser;

  beforeEach(() => {
    queue = new Queue(10);
    parser = new Parser(SAMPLE_TEST_FILEPATH, queue);
  });

  it('should read the next line', () => {
    parser.readLine();
    expect(queue.getLastElements(10).length).toEqual(1);
  });
});
