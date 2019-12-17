import { Queue, Log } from '@barkbark/lib';

/**
 * Queue to store Log type objects.
 *
 * It defines a few more methods to handle the logic of the app.
 * @extends Queue
 */
export class LogQueue extends Queue<Log> {
  /**
   * The newest date of all the logs contained in the queue.
   */
  private newestDate: number;

  constructor(capacity: number) {
    super(capacity);
    this.newestDate = 0;
  }

  /**
   * Enqueue a given log into the store.
   *
   * It overrides super method in order to update the field newestDate.
   * @param log the given log
   * @see Queue#enqueue
   */
  public enqueue = (log: Log): void => {
    if (this._isFull()) {
      this.dequeue();
    }
    this._size++;
    this.newestDate = Math.max(this.newestDate, log.date);
    this._store.push(log);
  };

  /**
   * Get logs in the store in a given timeframe.
   *
   * The last date of the timeframe if the newestDate property of this classe
   * @param timeframe the given timeframe
   */
  public getLogsInTimeframe = (timeframe: number): Log[] => {
    return this._store.filter(log => this.newestDate - log.date < timeframe);
  };
}
