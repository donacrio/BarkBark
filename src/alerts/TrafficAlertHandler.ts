import { AlertHandler } from './AlertHandler';
import { TrafficAggregator } from '@barkbark/aggregators';

export class TrafficAlertHandler extends AlertHandler {
  constructor(aggregator: TrafficAggregator) {
    super(aggregator);
  }

  public compute = (): void => {};

  public getAlerts = (): string[] => {
    return [];
  };
}
