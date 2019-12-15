export class Queue<T> {
  protected _capacity: number;
  protected _size: number;
  protected _store: T[];

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

  public getSize = (): number => this._size;

  public getLastElements = (n: number): T[] => {
    const start = Math.max(0, this._size - n);
    return this._store.slice(start, this._store.length);
  };

  protected _isFull = (): boolean => {
    return this._size == this._capacity;
  };

  protected _isEmpty = (): boolean => {
    return this._size == 0;
  };
}
