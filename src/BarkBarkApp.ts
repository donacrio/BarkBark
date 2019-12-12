import path from 'path';

import { Parser } from './Parser';
import { Queue } from './Queue';
import { Log } from './types';

export class BarkBarkApp {
  private logsQueue: Queue<Log>;
  private parser: Parser;

  constructor() {
    this.logsQueue = new Queue(1000);
    this.parser = new Parser(path.join(__dirname, '..', 'data', 'sample.csv'), this.logsQueue);
  }

  run() {
    setInterval(() => this.parser.readLine(), 10);
    setInterval(() => console.log(this.logsQueue.getLastElements(1)), 1000);
  }
}
