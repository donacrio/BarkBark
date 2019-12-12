import * as path from 'path';
import { AbstractParser } from '../AbstractParser';
import { FileParser } from '../FileParser';
import { Queue } from '../../lib/Queue';
import { Log } from '../../types';

describe('Test AbstractParser', () => {
  let queue: Queue<Log>;
  let parser: AbstractParser;

  beforeEach(() => {
    queue = new Queue<Log>(10);
    parser = new FileParser(queue, { filepath: path.join(__dirname, 'test_data.csv') });
  });

  it('should parse the logs', () => {
    parser.readLine();
    parser.readLine();
    expect(queue.getLastElements(10)).toEqual(['"10.0.0.2","-","apache",1549573860,"GET /api/user HTTP/1.0",200,1234']);
  });
});
