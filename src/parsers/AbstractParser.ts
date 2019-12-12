import * as RL from 'readline';
export abstract class AbstractParser {
  private readLine: RL.Interface;

  constructor(input: NodeJS.ReadableStream) {
    this.readLine = RL.createInterface({
      input
    });
  }
}
