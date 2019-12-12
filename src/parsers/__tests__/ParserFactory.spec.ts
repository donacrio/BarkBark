import * as path from 'path';
import { ParserFactory } from '../ParserFactory';
import { ParserType } from '../types';
import { Queue } from '../../lib/Queue';
import { Log } from '../../types';
import { CLIParser } from '../CLIParser';
import { FileParser } from '../FileParser';
import { NoFilepathError } from '../../exceptions/NoFilepathError';
import { NotImplementedError } from '../../exceptions/NotImplementedError';

describe('Test ParserFactory', () => {
  let parserFactory: ParserFactory;
  let queue: Queue<Log>;

  beforeEach(() => {
    parserFactory = new ParserFactory();
    queue = new Queue<Log>(10);
  });

  it('should create a CLIParser instance', () => {
    const parser = parserFactory.getParser(ParserType.CLI, queue, {});
    expect(parser).toBeInstanceOf(CLIParser);
  });

  it('should create a FileParser instance', () => {
    const parser = parserFactory.getParser(ParserType.FILE, queue, { filepath: path.join(__dirname, 'test_data.csv') });
    expect(parser).toBeInstanceOf(FileParser);
  });

  it('should throw NoFilePathError', () => {
    expect(() => parserFactory.getParser(ParserType.FILE, queue, {})).toThrow(NoFilepathError);
  });

  it('should throw NotImplementedError', () => {
    expect(() => parserFactory.getParser(null!, queue, {})).toThrow(NotImplementedError);
  });
});
