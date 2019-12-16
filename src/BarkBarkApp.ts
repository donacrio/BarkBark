import { Parser } from '@barkbark/Parser';
import { AggregatorManager, AggregatorName } from '@barkbark/aggregators';

import { LogQueue } from './LogQueue';
import { AlerManager } from './alerts/AlertManager';

export class BarkBarkApp {
  private _logsQueue: LogQueue;
  private _parser: Parser;
  private _aggregatorManager: AggregatorManager;
  private _alertManager: AlerManager;

  constructor(filepath: string) {
    this._logsQueue = new LogQueue(1000);
    this._parser = new Parser(filepath, this._logsQueue);
    this._aggregatorManager = new AggregatorManager(this._logsQueue);
    this._alertManager = new AlerManager();
    this._aggregatorManager.addAggregator(AggregatorName.TRAFFIC, 10000);
    this._aggregatorManager.addAggregator(AggregatorName.SECTIONS, 10000);
  }

  run() {
    setInterval(() => this._parser.readLine(), 1);
    setInterval(() => this._aggregatorManager.compute(), 1000);
  }
}
