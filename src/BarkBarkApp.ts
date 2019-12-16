import { Parser } from '@barkbark/Parser';
import { LogQueue } from '@barkbark/LogQueue';
import { AggregatorManager, AggregatorName, Aggregator } from '@barkbark/aggregators';
import { AlerManager } from '@barkbark/alerts';
import { BarkBarkUI } from '@barkbark/ui';
import { BarkBarkConfig } from '@barkbark/lib';

export class BarkBarkApp {
  private _parser: Parser;
  private _logsQueue: LogQueue;
  private _aggregatorManager: AggregatorManager;
  private _alertManager: AlerManager;
  private _ui: BarkBarkUI;

  constructor(config: BarkBarkConfig) {
    this._logsQueue = new LogQueue(config.parser.queueSize);
    this._parser = new Parser(config.parser.logfile, this._logsQueue, config.parser.refreshTime);
    this._aggregatorManager = new AggregatorManager(this._logsQueue, config.aggregatorManager.refreshTime);
    this._alertManager = new AlerManager(config.alertsManager.refreshTime);
    this._ui = new BarkBarkUI(config.ui.refreshTime);

    try {
      config.aggregatorManager.aggregators.forEach(aggregatorConfig =>
        this._aggregatorManager.addAggregator(
          this._aggregatorManager.getAggregator(aggregatorConfig.name, aggregatorConfig.timeframe)
        )
      );
      config.alertsManager.alerts.forEach(alertConfig => {
        const aggregator: Aggregator = this._aggregatorManager.getAggregator(
          alertConfig.aggregator.name,
          alertConfig.aggregator.timeframe
        );
        this._alertManager.addAlertHandlerForAggregator(aggregator, alertConfig.threshold);
        this._aggregatorManager.addAggregator(aggregator);
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  run() {
    setInterval(() => this._parser.readLine(), this._parser.getRefreshTime());
    setInterval(() => this._aggregatorManager.compute(), this._aggregatorManager.getRefreshTime());
    setInterval(() => this._alertManager.compute(), this._alertManager.getRefreshTime());
    setInterval(() => {
      this._ui.setMetricsTableData(this._aggregatorManager.getPrintableMetrics());
      this._ui.setAlerts(this._alertManager.getPrintableAlerts());
      this._ui.render();
    }, this._ui.getRefreshTime());
  }
}
