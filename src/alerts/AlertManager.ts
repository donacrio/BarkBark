import { Aggregator, AggregatorName, TrafficAggregator, SectionsAggregator } from '@barkbark/aggregators';

import { AlertHandler } from './AlertHandler';
import { TrafficAlertHandler } from './TrafficAlertHandler';
import { SectionsAlertHandler } from './SectionsAlertHandler';

export class AlerManager {
  private _alertHandlers: AlertHandler[];
  private _printableAlerts: string[];

  constructor() {
    this._alertHandlers = [];
    this._printableAlerts = [];
  }

  public compute = (): void => {
    this._alertHandlers
      .map(alertHandler => alertHandler.compute())
      .forEach(alerts => this._printableAlerts.push(...alerts));
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

  private _getAlertHandler(aggregator: Aggregator, threshold: number) {
    switch (aggregator.getName()) {
      case AggregatorName.TRAFFIC:
        return new TrafficAlertHandler(<TrafficAggregator>aggregator, threshold);
      case AggregatorName.SECTIONS:
        return new SectionsAlertHandler(<SectionsAggregator>aggregator, threshold);
      default:
        throw new Error(`AlertHandler for aggregator ${aggregator.getName()} not yet implemented`);
    }
  }
}
