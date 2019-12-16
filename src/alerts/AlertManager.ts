import { Aggregator, AggregatorName, TrafficAggregator, SectionsAggregator } from '@barkbark/aggregators';
import { AlertHandler } from './AlertHandler';
import { TrafficAlertHandler } from './TrafficAlertHandler';
import { SectionsAlertHandler } from './SectionsAlertHandler';

export class AlerManager {
  private _alertHandlers: AlertHandler[];

  constructor() {
    this._alertHandlers = [];
  }

  public compute = (): void => {
    this._alertHandlers.forEach(alertHandler => alertHandler.compute());
  };

  public addAlertHandlerForAggregator(aggregator: Aggregator) {
    try {
      const alertHandler: AlertHandler = this.getAlertHandler(aggregator);
      this._alertHandlers.push(alertHandler);
    } catch (e) {
      console.log(`Could not add AlertHandler for aggregator ${aggregator.getName()}:\n${e.message}`);
    }
  }

  public getAlertHandler(aggregator: Aggregator) {
    switch (aggregator.getName()) {
      case AggregatorName.TRAFFIC:
        return new TrafficAlertHandler(<TrafficAggregator>aggregator);
      case AggregatorName.SECTIONS:
        return new SectionsAlertHandler(<SectionsAggregator>aggregator);
      default:
        throw new Error(`AlertHandler for aggregator ${aggregator.getName()} not yet implemented`);
    }
  }
}
