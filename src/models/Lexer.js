import { Analyzer } from './Analyzer.js';
import { Token } from './Token.js';

import dictionary from '../dictionary.js';

export class Lexer {
  constructor(input) {
    // remove newlines
    this.input = input.replace(/\n/g, ' ');
    this.position = 0;
  }

  getNextToken() {
    while (this.position < this.input.length) {
      let char = this.input.at(this.position);

      if (Analyzer.isWhiteSpace(char)) {
        this.position += 1;
        continue;
      }

      // Identifiers and keywords
      if (Analyzer.isAlpha(char)) {
        let identifier = '';

        while (Analyzer.isAlpha(char) || Analyzer.isDigit(char)) {
          identifier += char;
          this.position += 1;
          char = this.input.at(this.position);
        }

        const keyword = dictionary.keywords[identifier];

        if (keyword) {
          return new Token(keyword, identifier);
        }

        return new Token('IDENTIFIER', identifier);
      }

      // Numbers
      if (Analyzer.isDigit(char)) {
        let number = '';

        while (Analyzer.isDigit(char)) {
          number += char;
          this.position += 1;
          char = this.input.at(this.position);
        }

        // Floats
        if (char === '.') {
          number += char;
          this.position += 1;
          char = this.input.at(this.position);

          // Check for ".(something_not_a_number)"
          if (!Analyzer.isDigit(char)) {
            throw new Error(`Invalid character: ${char}`);
          }

          while (Analyzer.isDigit(char)) {
            number += char;
            this.position += 1;
            char = this.input.at(this.position);
          }
        }

        return new Token('NUMBER', Number(number));
      }

      // Symbols
      const name = dictionary.symbols[char];
      const value = char;

      if (!name) {
        throw new Error(`Invalid character: ${char}`);
      }

      // Check for bigger symbols (>=, <=, ==, !=)
      const nextChar = this.input.at(this.position + 1);
      const biggerSymbol = dictionary.symbols[char + nextChar];

      if (biggerSymbol) {
        this.position += 2;
        return new Token(biggerSymbol, char + nextChar);
      }

      this.position += 1;
      return new Token(name, value);
    }

    return new Token('EOF', null);
  }
}
