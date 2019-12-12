import { AbstractParser } from './AbstractParser';
import { ParserOptions } from '@babel/core';

export class CLIParser extends AbstractParser {
  constructor() {
    super(process.stdin);
  }
}
