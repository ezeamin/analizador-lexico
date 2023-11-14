import { Analyzer } from './Analyzer.js';
import { Token } from './Token.js';

import dictionary from '../dictionary.js';

export class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
  }

  getNextToken() {
    let char = this.input.at(this.position);

    // EOF
    if (Analyzer.isEOF(char)) {
      this.position += 1;
      return new Token('EOF', null, null);
    }

    // New Lines (only for HTML highlighting)
    if (Analyzer.isNewLine(char)) {
      this.position += 1;
      return new Token('NEW_LINE', '\n', null);
    }

    // Whitespaces (only for HTML highlighting)
    if (Analyzer.isWhiteSpace(char)) {
      this.position += 1;
      return new Token('SPACE', ' ', null);
    }

    // Identifiers and keywords
    if (Analyzer.isAlpha(char)) {
      let identifier = '';

      while (char && (Analyzer.isAlpha(char) || Analyzer.isDigit(char))) {
        identifier += char;
        this.position += 1;
        char = this.input.at(this.position);
      }

      const keyword = dictionary.keywords[identifier];

      if (keyword) {
        return new Token(keyword.value, identifier, keyword.color);
      }

      return new Token('Identificador', identifier, '#ffffff');
    }

    // Numbers
    if (Analyzer.isDigit(char)) {
      let number = '';

      while (char && Analyzer.isDigit(char)) {
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
          const lineNumber =
            this.input.split('\n').findIndex((el) => el.includes(char)) + 1;
          const columnNumber =
            this.position - this.input.lastIndexOf('\n', this.position);

          throw new Error(
            `(${lineNumber},${columnNumber}) Caracter inválido: ${char}`,
          );
        }

        while (Analyzer.isDigit(char)) {
          number += char;
          this.position += 1;
          char = this.input.at(this.position);
        }
      }

      return new Token('Número', Number(number), '#d8c0c0');
    }

    // Symbols
    const symbol = dictionary.symbols[char];
    const value = char;

    if (!symbol) {
      const lineNumber =
        this.input.split('\n').findIndex((el) => el.includes(char)) + 1;
      const columnNumber =
        this.position - this.input.lastIndexOf('\n', this.position);

      throw new Error(
        `(${lineNumber},${columnNumber}) Caracter inválido: ${char}`,
      );
    }

    this.position += 1;
    return new Token(symbol.value, value, symbol.color);
  }
}
