import { LogQueue, Parser } from '@barkbark/parser';
import { AggregatorManager } from '@barkbark/aggregators';
import { AlerManager } from '@barkbark/alerts';
import { BarkBarkUI } from '@barkbark/ui';
import { BarkBarkConfig } from '@barkbark/lib';
import { LogSimulator } from './LogSimulator';

export class BarkBarkApp {
  private _intervals: NodeJS.Timeout[];
  private _logSimulator: LogSimulator | null;
  private _parser: Parser;
  private _logsQueue: LogQueue;
  private _aggregatorManager: AggregatorManager;
  private _alertManager: AlerManager;
  private _ui: BarkBarkUI;

  constructor(config: BarkBarkConfig) {
    this._intervals = [];
    this._logsQueue = new LogQueue(config.parser.queueSize);
    if (config.simulation.running) {
      this._logSimulator = new LogSimulator(config.simulation.logfile, config.simulation.refreshTime);
      this._parser = new Parser(config.simulation.logfile, this._logsQueue, config.parser.refreshTime);
    } else {
      this._logSimulator = null;
      this._parser = new Parser(config.parser.logfile, this._logsQueue, config.parser.refreshTime);
    }
    this._aggregatorManager = new AggregatorManager(this._logsQueue, config.aggregatorManager.refreshTime);
    this._alertManager = new AlerManager(config.alertsManager.refreshTime);
    this._ui = new BarkBarkUI(config.ui.refreshTime);

    try {
      config.aggregatorManager.aggregators.forEach(aggregatorConfig =>
        this._aggregatorManager.addAggregator(
          this._aggregatorManager.getAggregator(aggregatorConfig.metricName, aggregatorConfig.timeframe)
        )
      );
      config.alertsManager.alerts.forEach(alertConfig => {
        const aggregator = this._aggregatorManager.getAggregator(
          alertConfig.aggregator.metricName,
          alertConfig.aggregator.timeframe
        );
        this._alertManager.addAlertHandlerForAggregator(aggregator, alertConfig.threshold);
        this._aggregatorManager.addAggregator(aggregator);
      });
    } catch (e) {}
    if (this._logSimulator != null) {
      for (let i = 0; i < 500; i++) {
        this._logSimulator!.write();
      }
    }
  }

  public run = (): void => {
    if (this._logSimulator != null) {
      this._intervals.push(setInterval(() => this._logSimulator!.write(), this._logSimulator!.getRefreshTime()));
    }
    this._intervals.push(setInterval(() => this._parser.readLine(), this._parser.getRefreshTime()));
    this._intervals.push(
      setInterval(() => this._aggregatorManager.compute(), this._aggregatorManager.getRefreshTime())
    );
    this._intervals.push(setInterval(() => this._alertManager.compute(), this._alertManager.getRefreshTime()));
    this._intervals.push(
      setInterval(() => {
        this._ui.setMetricsTableData(this._aggregatorManager.getAggregatorMetrics());
        this._ui.setAlerts(this._alertManager.getAlerts());
        this._alertManager.clearAlerts();
        this._ui.render();
      }, this._ui.getRefreshTime())
    );
  };

  public stop = (): void => {
    this._intervals.forEach(interval => clearInterval(interval));
    this._ui.destroy();
    return process.exit(0);
  };
}
