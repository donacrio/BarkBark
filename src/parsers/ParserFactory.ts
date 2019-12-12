import { Parser } from './types';
import { CLIParser } from './CLIParser';
import { AbstractParser } from './AbstractParser';
import { FileParser } from './FileParser';
import { NotImplementedError } from '../exceptions/NotImplementedError';
export class ParserFactory {
  getParser = (parser: Parser): AbstractParser => {
    switch (parser) {
      case Parser.CLI:
        return new CLIParser();
      case Parser.FILE:
        return new FileParser();
      default:
        throw new NotImplementedError(`Parser ${parser} is not implemented`);
    }
  };
}
