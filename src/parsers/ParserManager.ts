import { ParserFactory } from './ParserFactory';
import { AbstractParser } from './AbstractParser';
import { Queue } from '../lib/Queue';
import { Log } from '../types';
import { ParserType, ParserOptions } from './types';

export class ParserManager {
  private factory: ParserFactory;
  private parsers: AbstractParser[];
  public queue: Queue<Log>;

  constructor(queueSize?: number) {
    this.factory = new ParserFactory();
    this.parsers = [];
    this.queue = new Queue<Log>(queueSize ? queueSize : 1000);
  }

  addParser(parserType: ParserType, options: ParserOptions): void {
    try {
      const parser: AbstractParser = this.factory.getParser(parserType, this.queue, options);
      this.parsers.push(parser);
    } catch (e) {}
  }

  run() {
    this.parsers.forEach(parser => setInterval(() => parser.readLine(), 1000));
  }
}
