import { AggregatorName } from './types';
import { Queue } from '@barkbark/Queue';
import { Log } from '@barkbark/types';

export abstract class Aggregator {
  protected _name: AggregatorName;
  protected _queue: Queue<Log>;
  protected _timeframe: number;

  constructor(name: AggregatorName, queue: Queue<Log>, timeframe: number) {
    this._name = name;
    this._queue = queue;
    this._timeframe = timeframe;
  }

  public getName = (): AggregatorName => this._name;
  public getTimeframe = (): number => this._timeframe;

  public abstract compute(): void;

  protected _getLogsInTimeframe = (): Log[] => {
    const logs = this._queue.getLastElements(this._queue.getSize());
    if (logs.length > 0) {
      const timeEnd: number = logs[logs.length - 1].date;
      return logs.filter(log => timeEnd - log.date <= this._timeframe);
    }
    return [];
  };
}
