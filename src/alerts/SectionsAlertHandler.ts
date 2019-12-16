import { AlertHandler } from './AlertHandler';
import { SectionsAggregator } from '@barkbark/aggregators';

export class SectionsAlertHandler extends AlertHandler {
  constructor(aggregator: SectionsAggregator) {
    super(aggregator);
  }

  public compute = (): void => {};

  public getAlerts = (): string[] => {
    return [];
  };
}
