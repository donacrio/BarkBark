import { Parser } from '@barkbark/Parser';
import { LogQueue } from '@barkbark/LogQueue';
import { AggregatorManager, AggregatorName } from '@barkbark/aggregators';
import { AlerManager } from '@barkbark/alerts';
import { BarkBarkUI } from '@barkbark/ui';

export class BarkBarkApp {
  private _parser: Parser;
  private _logsQueue: LogQueue;
  private _aggregatorManager: AggregatorManager;
  private _alertManager: AlerManager;
  private _ui: BarkBarkUI;

  constructor(filepath: string) {
    this._logsQueue = new LogQueue(1000);
    this._parser = new Parser(filepath, this._logsQueue);
    this._aggregatorManager = new AggregatorManager(this._logsQueue);
    this._alertManager = new AlerManager();
    this._ui = new BarkBarkUI();
    try {
      const trafficAggregator = this._aggregatorManager.getAggregator(AggregatorName.TRAFFIC, 10);
      this._aggregatorManager.addAggregator(trafficAggregator);
      this._alertManager.addAlertHandlerForAggregator(trafficAggregator, 8);
      const sectionTrafficAggregator = this._aggregatorManager.getAggregator(AggregatorName.SECTIONS, 10);
      this._aggregatorManager.addAggregator(sectionTrafficAggregator);
      // this._alertManager.addAlertHandlerForAggregator(sectionTrafficAggregator, 3);
    } catch (e) {
      console.log(`Could not add aggregators:\n${e.message}`);
      this._aggregatorManager = new AggregatorManager(this._logsQueue);
    }
  }

  run() {
    setInterval(() => this._parser.readLine(), 10);
    setInterval(() => this._aggregatorManager.compute(), 500);
    setInterval(() => this._alertManager.compute(), 500);
    setInterval(() => {
      this._ui.setMetricsTableData(this._aggregatorManager.getPrintableMetrics());
      this._ui.setAlerts(this._alertManager.getPrintableAlerts());
      this._ui.render();
    }, 1000);
  }
}
