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
    try {
      const trafficAggregator = this._aggregatorManager.getAggregator(AggregatorName.TRAFFIC, 30);
      this._aggregatorManager.addAggregator(trafficAggregator);
      this._alertManager.addAlertHandlerForAggregator(trafficAggregator, 5);
      const sectionTrafficAggregator = this._aggregatorManager.getAggregator(AggregatorName.SECTIONS, 30);
      this._aggregatorManager.addAggregator(sectionTrafficAggregator);
      this._alertManager.addAlertHandlerForAggregator(sectionTrafficAggregator, 3);
    } catch (e) {
      console.log(`Could not add aggregators:\n${e.message}`);
      this._aggregatorManager = new AggregatorManager(this._logsQueue);
    }
  }

  run() {
    setInterval(() => this._parser.readLine(), 1);
    setInterval(() => this._aggregatorManager.compute(), 1);
    setInterval(() => {
      this._alertManager.compute();
      console.log(this._alertManager.getPrintableAlerts());
    }, 2);
  }
}
