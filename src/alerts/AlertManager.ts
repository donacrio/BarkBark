import { Aggregator, AggregatorName, TrafficAggregator, SectionTrafficAggregator } from '@barkbark/aggregators';

import { AlertHandler } from './AlertHandler';
import { TrafficAlertHandler } from './TrafficAlertHandler';
import { SectionTrafficAlertHandler } from './SectionTrafficAlertHandler';

export class AlerManager {
  private _alertHandlers: AlertHandler[];
  private _printableAlerts: string[];
  private _refreshTime: number;

  constructor(refreshTime: number) {
    this._alertHandlers = [];
    this._printableAlerts = [];
    this._refreshTime = refreshTime;
  }

  public compute = (): void => {
    this._alertHandlers
      .map(alertHandler => alertHandler.compute())
      .forEach(printableAlerts => this._printableAlerts.push(...printableAlerts));
  };

  public addAlertHandlerForAggregator(aggregator: Aggregator, threshold: number) {
    try {
      const alertHandler: AlertHandler = this._getAlertHandler(aggregator, threshold);
      this._alertHandlers.push(alertHandler);
    } catch (e) {
      console.log(`Could not add AlertHandler for aggregator ${aggregator.getName()}:\n${e.message}`);
    }
  }

  public getPrintableAlerts = (): string[] => this._printableAlerts;

  public getRefreshTime = (): number => this._refreshTime;

  private _getAlertHandler(aggregator: Aggregator, threshold: number) {
    switch (aggregator.getName()) {
      case AggregatorName.TRAFFIC:
        return new TrafficAlertHandler(<TrafficAggregator>aggregator, threshold);
      case AggregatorName.SECTIONS:
        return new SectionTrafficAlertHandler(<SectionTrafficAggregator>aggregator, threshold);
      default:
        throw new Error(`AlertHandler for aggregator ${aggregator.getName()} not yet implemented`);
    }
  }
}
