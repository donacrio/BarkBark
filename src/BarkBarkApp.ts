import * as path from 'path';
import { ParserManager } from './parsers/ParserManager';
import { ParserType } from './parsers/types';

export class BarkBarkApp {
  private parserManager: ParserManager;

  constructor() {
    this.parserManager = new ParserManager();
    this.parserManager.addParser(ParserType.FILE, {
      filepath: path.join(__dirname, '..', 'data', 'sample.csv')
    });
    this.parserManager.addParser(ParserType.CLI, {});
  }

  run() {
    this.parserManager.run();
  }
}
