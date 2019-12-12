import { PathLike } from 'fs';

export enum Parser {
  CLI = 'cli',
  FILE = 'file'
}

export type ParserOptions = {
  filepath?: PathLike;
};
