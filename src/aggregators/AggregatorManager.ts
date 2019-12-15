import { Log } from '@barkbark/types';
import { LogQueue } from '@barkbark/LogQueue';

import { Aggregator } from './Aggregator';
import { TrafficAggregator } from './TrafficAggregator';
import { SectionAggregator } from './SectionsAggregator';

import { AggregatorName } from '.';

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

  public addAggregator = (aggregatorName: AggregatorName, timeframe: number): void => {
    try {
      const aggregator: Aggregator = this._getAggregator(aggregatorName, timeframe);
      this._aggregators.push(aggregator);
    } catch (e) {
      console.log(`Could not add aggregator ${aggregatorName}:\n${e.message}`);
    }
  };

  private _getAggregator = (aggregatorName: AggregatorName, timeframe: number): Aggregator => {
    switch (aggregatorName) {
      case AggregatorName.SECTIONS:
        return new SectionAggregator(this._logQueue, timeframe);
      case AggregatorName.TRAFFIC:
        return new TrafficAggregator(this._logQueue, timeframe);
      default:
        throw new Error(`Aggregator ${aggregatorName} not yet implemented`);
    }
  };
}
