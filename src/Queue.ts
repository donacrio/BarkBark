import { Log } from './types';

export class Queue<T> {
  private capacity: number;
  private size: number;
  private store: T[];

  constructor(capacity: number) {
    this.capacity = Math.round(capacity);
    this.size = 0;
    this.store = [];
  }

  isFull = () => this.size == this.capacity;
  isEmpty = () => this.size == 0;

  enqueue = (el: T) => {
    if (this.isFull()) {
      return;
    }
    this.size++;
    this.store.push(el);
  };

  dequeue = (): T | null => {
    if (this.isEmpty()) {
      return null;
    }
    this.size--;
    return this.store.shift()!;
  };
}
