import { Queue } from '../Queue';

describe('Test Queue.ts', () => {
  let queue: Queue<number>;

  beforeEach(() => (queue = new Queue<number>(10)));

  it('should instanciate as empty queue', () => {
    expect(queue.getLastElements(1)).toEqual([]);
  });

  it('should enqueue element', () => {
    queue.enqueue(1);
    expect(queue.getLastElements(1)).toEqual([1]);
  });

  it('should return last elements', () => {
    for (let i = 0; i < 10; i++) {
      queue.enqueue(i);
    }
    expect(queue.getLastElements(0)).toEqual([]);
    expect(queue.getLastElements(1)).toEqual([9]);
    expect(queue.getLastElements(5)).toEqual([5, 6, 7, 8, 9]);
    expect(queue.getLastElements(20)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should dequeue element', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue.getLastElements(10)).toEqual([1, 2]);
    const el = queue.dequeue();
    expect(el).toEqual(1);
    expect(queue.getLastElements(10)).toEqual([2]);
  });

  it('should dequeue null if empty', () => {
    const el = queue.dequeue();
    expect(el).toBeNull();
    expect(queue.getLastElements(10)).toEqual([]);
  });

  test('should dequeue if full', () => {
    for (let i = 0; i < 10; i++) {
      queue.enqueue(i);
    }
    expect(queue.getLastElements(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    queue.enqueue(10);
    expect(queue.getLastElements(10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
