import { Aggregator } from '@barkbark/aggregators';
import { Alert } from '@barkbark/lib';

export abstract class AlertHandler {
  protected _aggregator: Aggregator;
  protected _threshold: number;

  constructor(aggregator: Aggregator, threshold: number) {
    this._aggregator = aggregator;
    this._threshold = threshold;
  }

  public abstract compute(): Alert | null;
}
