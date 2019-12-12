import * as fs from 'fs';
import { AbstractParser } from './AbstractParser';
import { ParserOptions } from './types';
import { NoFilepathError } from '../exceptions/NoFilepathError';
import { Queue } from '../lib/Queue';
import { Log } from '../types';

export class FileParser extends AbstractParser {
  constructor(queue: Queue<Log>, options: ParserOptions) {
    if (!options.filepath) {
      throw new NoFilepathError('The path was not specified');
    }
    const fileStream = fs.createReadStream(options.filepath);
    super(fileStream, queue);
  }
}
