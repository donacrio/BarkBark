import { AbstractParser } from './AbstractParser';
import { ParserOptions } from './types';
import { Queue } from '../Queue';
import { Log } from '../types';

export class CLIParser extends AbstractParser {
  constructor(queue: Queue<Log>, _options: ParserOptions) {
    super(process.stdin, queue);
  }
}
