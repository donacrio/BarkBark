import blessed from 'blessed';

const screenOpt: blessed.Widgets.IScreenOptions = {
  smartCSR: true,
  title: 'BarkBark'
};

const metricsTableOpts: blessed.Widgets.TableOptions = {
  top: '0%',
  left: '0%',
  height: '50%',
  width: '100%',
  tags: true,
  border: {
    type: 'line'
  }
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

  public setMetricsTableData = (data: string[][]): void => {
    this._metricsTable.setData(data);
  };

  public setAlerts = (alerts: string[]): void => {
    this._alertsLogger.setContent(''); // We reset the alert logger content
    alerts.forEach(alert => this._alertsLogger.log(alert));
  };

  public getRefreshTime = (): number => this._refreshTime;
}
