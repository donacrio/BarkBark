import blessed from 'blessed';
import { Metric, SectionTrafficAlert, TrafficAlert, Alert } from '@barkbark/lib';

import {
  formatMetricName,
  isTrafficAlert,
  formatTrafficAlert,
  formatSectionTrafficAlert,
  formatMetricValue,
  formatMetricUpdateDate
} from './utils';

//---------- WIDGET OPTIONS ----------

const screenOpt: blessed.Widgets.IScreenOptions = {
  smartCSR: true,
  title: 'BarkBark',
  dockBorders: true
};

const metricsTableOpts: blessed.Widgets.TableOptions = {
  top: '0%',
  left: '0%',
  height: '50%',
  width: '100%',
  tags: true,
  border: {
    type: 'line'
  },
  noCellBorders: true
};

const alertsLoggerOpts: blessed.Widgets.LogOptions = {
  top: '50%',
  left: '0%',
  height: '50%',
  width: '100%',
  tags: true,
  border: {
    type: 'line'
  }
};

//---------- END ----------

/**
 * User interface of the app.
 *
 * Metrics and alerts can be set using respectively setMetricsTableData and setAlerts.
 */
export class BarkBarkUI {
  private _screen: blessed.Widgets.Screen;
  private _metricsTable: blessed.Widgets.TableElement;
  private _alertsLogger: blessed.Widgets.Log;
  private _refreshTime: number;

  constructor(refreshTime: number) {
    this._screen = blessed.screen(screenOpt);
    this._metricsTable = blessed.table(metricsTableOpts);
    this._alertsLogger = blessed.log(alertsLoggerOpts);
    this._refreshTime = refreshTime;

    this._screen.append(this._metricsTable);
    this._screen.append(this._alertsLogger);
    this._screen.key(['escape', 'q', 'C-c'], function() {
      return process.exit(0);
    });
  }

  public render = (): void => {
    this._screen.render();
  };

  public destroy = (): void => {
    this._screen.destroy();
  };

  /**
   * Set view of the given metrics.
   *
   * @param metrics the given metrics
   */
  public setMetricsTableData = (metrics: Metric[]): void => {
    // We sort the metrics for display purpose
    metrics = metrics.sort((a, b) => -a.metricName.localeCompare(b.metricName));
    const data = metrics.map(metric => [
      formatMetricName(metric),
      formatMetricValue(metric),
      formatMetricUpdateDate(metric)
    ]);
    // We set the headers and the data
    this._metricsTable.setData([
      ['{bold}Metric name{/bold}', '{bold}Metric value{/bold}', '{bold}Metric update date{/bold}'],
      ...data
    ]);
  };

  /**
   * Log the given new alerts into the alert logger
   *
   * @param alert the given alerts
   */
  public setAlerts = (alerts: Alert[]): void => {
    alerts.forEach(alert =>
      isTrafficAlert(alert)
        ? this._alertsLogger.log(formatTrafficAlert(alert as TrafficAlert))
        : formatSectionTrafficAlert(alert as SectionTrafficAlert).forEach(sectionTrafficAlert =>
            this._alertsLogger.log(sectionTrafficAlert)
          )
    );
  };

  public getRefreshTime = (): number => this._refreshTime;
}
