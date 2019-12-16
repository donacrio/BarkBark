import { Queue, Log } from '@barkbark/lib';

export class LogQueue extends Queue<Log> {
  private newestDate: number;

  constructor(capacity: number) {
    super(capacity);
    this.newestDate = 0;
  }

  public enqueue = (log: Log): void => {
    if (this._isFull()) {
      this.dequeue();
    }
    this._size++;
    this.newestDate = Math.max(this.newestDate, log.date);
    this._store.push(log);
  };

  public getLogsInTimeframe = (timeframe: number): Log[] => {
    return this._store.filter(log => this.newestDate - log.date < timeframe);
  };
}
