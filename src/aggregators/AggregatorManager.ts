import { Aggregator } from './Aggregator';
import { AggregatorName } from '.';
import { TrafficAggregator } from './TrafficAggregator';
import { SectionAggregator } from './SectionsAggregator';
import { Queue } from '@barkbark/Queue';
import { Log } from '@barkbark/types';

export class AggregatorManager {
  private _queue: Queue<Log>;
  private _aggregators: Aggregator[];

  constructor(queue: Queue<Log>) {
    this._queue = queue;
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
        return new SectionAggregator(this._queue, timeframe);
      case AggregatorName.TRAFFIC:
        return new TrafficAggregator(this._queue, timeframe);
      default:
        throw new Error(`Aggregator ${aggregatorName} not yet implemented`);
    }
  };
}
