import blessed from 'blessed';
import {
  Metric,
  TrafficMetricValue,
  SectionTrafficMetricValue,
  SectionTrafficAlert,
  TrafficAlert,
  Alert
} from '@barkbark/lib';
import {
  formatMetricName,
  isTrafficMetricValue,
  formatTrafficMetricValue,
  formatSectionTrafficMetricValue,
  isTrafficAlert,
  formatTrafficAlert,
  formatSectionTrafficAlert,
  formatTrafficMetricUpdateDate,
  formatSectionTrafficMetricUpdateDate
} from './utils';

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
    metrics = metrics.sort((a, b) => -a.metricName.localeCompare(b.metricName));
    const data = metrics.map(metric => [
      formatMetricName(metric),
      isTrafficMetricValue(metric.metricValue)
        ? formatTrafficMetricValue(metric.metricValue as TrafficMetricValue)
        : formatSectionTrafficMetricValue(metric.metricValue as SectionTrafficMetricValue),
      isTrafficMetricValue(metric.metricValue)
        ? formatTrafficMetricUpdateDate(metric.metricValue as TrafficMetricValue)
        : formatSectionTrafficMetricUpdateDate(metric.metricValue as SectionTrafficMetricValue)
    ]);
    this._metricsTable.setData([
      ['{bold}Metric name{/bold}', '{bold}Metric value{/bold}', '{bold}Metric update date{/bold}'],
      ...data
    ]);
  };

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
