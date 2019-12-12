import * as RL from 'readline';
import { Log } from '../types';
import { Queue } from '../lib/Queue';

export abstract class AbstractParser {
  private readLineInterface: RL.Interface;

  constructor(input: NodeJS.ReadableStream, queue: Queue<Log>) {
    this.readLineInterface = RL.createInterface({
      input
    });
    this.readLineInterface.on('line', (line: string) => {
      this.readLineInterface.pause();
      queue.enqueue(this.parseString(line));
    });
    this.readLineInterface.pause();
    this.readLine();
  }

  public readLine = (): void => {
    this.readLineInterface.resume();
  };

  public parseString = (str: string): Log => {
    const fields = str.split(',');
    return {
      remotehost: fields[0],
      rfc931: fields[1],
      authuser: fields[2],
      date: Number.parseInt(fields[3]),
      request: fields[4],
      status: Number.parseInt(fields[5]),
      bytes: Number.parseInt(fields[6])
    };
  };
}
