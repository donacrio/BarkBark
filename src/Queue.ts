export class Queue<T> {
  private _capacity: number;
  private _size: number;
  private _store: T[];

  constructor(capacity: number) {
    this._capacity = Math.round(capacity);
    this._size = 0;
    this._store = [];
  }

  public enqueue = (el: T): void => {
    if (this._isFull()) {
      this.dequeue();
    }
    this._size++;
    this._store.push(el);
  };

  public dequeue = (): T | null => {
    if (this._isEmpty()) {
      return null;
    }
    this._size--;
    return this._store.shift()!;
  };

  public getLastElements = (n: number): T[] => {
    const start = Math.max(0, this._size - n);
    return this._store.slice(start, this._store.length);
  };

  public getSize = (): number => this._size;

  private _isFull = (): boolean => {
    return this._size == this._capacity;
  };

  private _isEmpty = (): boolean => {
    return this._size == 0;
  };
}
