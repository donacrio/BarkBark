export class Queue<T> {
  private capacity: number;
  private size: number;
  private store: T[];

  constructor(capacity: number) {
    this.capacity = Math.round(capacity);
    this.size = 0;
    this.store = [];
  }

  public enqueue = (el: T): void => {
    if (this.isFull()) {
      this.dequeue();
    }
    this.size++;
    this.store.push(el);
  };

  public dequeue = (): T | null => {
    if (this.isEmpty()) {
      return null;
    }
    this.size--;
    return this.store.shift()!;
  };

  public getLastElements = (n: number): T[] => {
    const start = Math.max(0, this.size - n);
    return this.store.slice(start, this.store.length);
  };

  private isFull = (): boolean => {
    return this.size == this.capacity;
  };

  private isEmpty = (): boolean => {
    return this.size == 0;
  };
}
