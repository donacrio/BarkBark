import path from 'path';
import { Parser } from '@barkbark/Parser';
import { AggregatorManager, AggregatorName } from '@barkbark/aggregators';

import { LogQueue } from './LogQueue';

export class BarkBarkApp {
  private _logsQueue: LogQueue;
  private _parser: Parser;
  private _aggregatorManager: AggregatorManager;

  constructor() {
    this._logsQueue = new LogQueue(1000);
    this._parser = new Parser(path.join(__dirname, '..', 'data', 'sample.csv'), this._logsQueue);
    this._aggregatorManager = new AggregatorManager(this._logsQueue);
    this._aggregatorManager.addAggregator(AggregatorName.TRAFFIC, 10000);
    this._aggregatorManager.addAggregator(AggregatorName.SECTIONS, 10000);
  }

  run() {
    setInterval(() => this._parser.readLine(), 1);
    setInterval(() => this._aggregatorManager.compute(), 1000);
  }
}
