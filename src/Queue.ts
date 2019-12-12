import { Log } from './types';
import { waitFor } from './utils';

export type Fn = (...args: any[]) => any;

export class Queue<T> {
  private capacity: number;
  private size: number;
  private store: T[];

  constructor(capacity: number) {
    this.capacity = Math.round(capacity);
    this.size = 0;
    this.store = [];
  }

  public enqueue = async (el: T): Promise<void> => {
    if (this.isFull()) {
      this.dequeue();
    }
    this.size++;
    this.store.push(el);
  };

  public getLastElements = (n: number): T[] => {
    const arr: T[] = [];
    const start = Math.max(0, this.size - n);
    for (let i = start; i < this.size; i++) {
      arr[i] = this.store[i];
    }
    return arr;
  };

  private isFull = (): boolean => {
    return this.size == this.capacity;
  };

  private isEmpty = (): boolean => {
    return this.size == 0;
  };

  private dequeue = (): T | null => {
    if (this.isEmpty()) {
      return null;
    }
    this.size--;
    return this.store.shift()!;
  };
}
