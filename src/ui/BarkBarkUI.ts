import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { Alert, Metric, TrafficMetricValue, SectionTrafficMetricValue } from '@barkbark/lib';
import {
  isTrafficMetricValue,
  formatTrafficMetricValue,
  formatSectionTrafficMetricValue,
  formatMetricName
} from './utils';

const screenOpt: blessed.Widgets.IScreenOptions = {
  smartCSR: true,
  title: 'BarkBark'
};

const alertsLoggerOpts: blessed.Widgets.LogOptions = {
  title: 'Alerts',
  top: '50%',
  left: '0%',
  height: '50%',
  width: '100%',
  tags: true,
  border: {
    type: 'line'
  }
};

export class BarkBarkUI {
  private _screen: blessed.Widgets.Screen;
  private _metricsGrid: contrib.Widgets.GridElement;
  private _alertsLogger: blessed.Widgets.Log;
  private _refreshTime: number;

  constructor(refreshTime: number) {
    this._screen = blessed.screen(screenOpt);
    this._metricsGrid = new contrib.grid({
      rows: 0,
      cols: 0,
      top: '0%',
      left: '0%',
      border: { type: 'line' },
      screen: this._screen
    });
    this._alertsLogger = blessed.log(alertsLoggerOpts);
    this._refreshTime = refreshTime;

    // this._screen.append(this._metricsGrid);
    this._screen.append(this._alertsLogger);
    this._screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });
  }

  public render = (): void => {
    this._screen.render();
  };

  public destroy = (): void => {
    this._screen.destroy();
  };

  public setMetricsTableData = (metrics: Metric[]): void => {
    this._metricsGrid = new contrib.grid({
      rows: 3,
      cols: metrics.length,
      top: '0%',
      left: '0%',
      screen: this._screen
    });
    for (let i = 0; i < metrics.length; i++) {
      this._metricsGrid.set(0, i, 1, 1, blessed.bigtext({ content: formatMetricName(metrics[i]) }));
      isTrafficMetricValue(metrics[i].metricValue)
        ? this._metricsGrid.set(
            1,
            i,
            2,
            1,
            blessed.box,
            formatTrafficMetricValue(metrics[i].metricValue as TrafficMetricValue)
          )
        : this._metricsGrid.set(
            0,
            i,
            1,
            1,
            contrib.tree,
            formatSectionTrafficMetricValue(metrics[i].metricValue as SectionTrafficMetricValue)
          );
    }
  };

  public setAlerts = (alerts: Alert[]): void => {
    this._alertsLogger.setContent('');
    // alerts.forEach(alert => this._alertsLogger.log(alert));
  };

  public getRefreshTime = (): number => this._refreshTime;
}
