import { Aggregator } from '@barkbark/aggregators';

export abstract class AlertHandler {
  protected _aggregator: Aggregator;

  constructor(aggregator: Aggregator) {
    this._aggregator = aggregator;
  }

  public abstract compute(): void;

  public abstract getAlerts(): string[];
}
