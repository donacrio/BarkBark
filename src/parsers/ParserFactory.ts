import { ParserType, ParserOptions } from './types';
import { CLIParser } from './CLIParser';
import { AbstractParser } from './AbstractParser';
import { FileParser } from './FileParser';
import { NotImplementedError } from '../exceptions/NotImplementedError';
import { Log } from '../types';
import { Queue } from '../lib/Queue';

export class ParserFactory {
  getParser = (parserType: ParserType, queue: Queue<Log>, options: ParserOptions): AbstractParser => {
    switch (parserType) {
      case ParserType.CLI:
        return new CLIParser(queue, options);
      case ParserType.FILE:
        return new FileParser(queue, options);
      default:
        throw new NotImplementedError(`Parser ${parserType} is not implemented`);
    }
  };
}
