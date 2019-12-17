import { LogQueue, Parser } from '@barkbark/parser';
import { AggregatorManager } from '@barkbark/aggregators';
import { AlerManager } from '@barkbark/alerts';
import { BarkBarkUI } from '@barkbark/ui';
import { BarkBarkConfig, SimulationType } from '@barkbark/lib';

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

    if (config.simulation.type != SimulationType.STATIC) {
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
      // We populate the aggregator manager with the aggregators
      config.aggregatorManager.aggregators.forEach(aggregatorConfig =>
        this._aggregatorManager.addAggregator(
          this._aggregatorManager.getAggregator(aggregatorConfig.metricName, aggregatorConfig.timeframe)
        )
      );

      // We populate the alert manager with the alert handlers
      config.alertsManager.alerts.forEach(alertConfig => {
        const aggregator = this._aggregatorManager.getAggregator(
          alertConfig.aggregator.metricName,
          alertConfig.aggregator.timeframe
        );
        this._alertManager.addAlertHandlerForAggregator(aggregator, alertConfig.threshold);
        this._aggregatorManager.addAggregator(aggregator);
      });
    } catch (e) {}

    // We create 500 lines of logs before running the simulation
    if (config.simulation.type == SimulationType.RUNNING) {
      for (let i = 0; i < 200; i++) {
        this._logSimulator!.write();
      }
    }
    if (config.simulation.type == SimulationType.TEST) {
      this._logSimulator?.createAlertingLogicTestSimulation(config.simulation.logfile);
      this._logSimulator = null;
    }
  }

  public run = (): void => {
    // If we run a simulation we set the simulation interval with the simulation refresh time
    if (this._logSimulator != null) {
      this._intervals.push(setInterval(() => this._logSimulator!.write(), this._logSimulator!.getRefreshTime()));
    }

    // We set the parser interval with the parser refresh time
    this._intervals.push(setInterval(() => this._parser.readLine(), this._parser.getRefreshTime()));

    // We set the aggregator manager interval with the aggregator manager refresh time
    this._intervals.push(
      setInterval(() => this._aggregatorManager.compute(), this._aggregatorManager.getRefreshTime())
    );

    // We set the parser interval with the parser refresh time
    this._intervals.push(setInterval(() => this._alertManager.compute(), this._alertManager.getRefreshTime()));
    // We set the ui interval with the ui refresh time
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
    // We clear all the intervals
    this._intervals.forEach(interval => clearInterval(interval));
    this._ui.destroy();
    return process.exit(0);
  };
}
