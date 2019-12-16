import { LogQueue } from '@barkbark/LogQueue';

import { Aggregator } from './Aggregator';
import { TrafficAggregator } from './TrafficAggregator';
import { SectionTrafficAggregator } from './SectionTrafficAggregator';
import { AggregatorName } from './types';

export class AggregatorManager {
  private _logQueue: LogQueue;
  private _aggregators: Aggregator[];

  constructor(logQueue: LogQueue) {
    this._logQueue = logQueue;
    this._aggregators = [];
  }

  public compute = (): void => {
    this._aggregators.forEach(aggregator => aggregator.compute());
  };

  public addAggregator = (aggregator: Aggregator): void => {
    this._aggregators.push(aggregator);
  };

  public getAggregator = (aggregatorName: AggregatorName, timeframe: number): Aggregator => {
    switch (aggregatorName) {
      case AggregatorName.SECTIONS:
        return new SectionTrafficAggregator(this._logQueue, timeframe);
      case AggregatorName.TRAFFIC:
        return new TrafficAggregator(this._logQueue, timeframe);
      default:
        throw new Error(`Aggregator ${aggregatorName} not yet implemented`);
    }
  };
}
