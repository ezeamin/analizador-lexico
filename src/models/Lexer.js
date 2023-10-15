import { Token } from './Token.js';

export class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
  }

  isWhiteSpace(char) {
    return /\s/.test(char);
  }

  isAlpha(char) {
    return /[a-zA-Z_]/.test(char);
  }

  isDigit(char) {
    return /\d/.test(char);
  }

  getNextToken() {
    while (this.position < this.input.length) {
      let char = this.input[this.position];

      if (this.isWhiteSpace(char)) {
        this.position += 1;
        continue;
      }

      if (this.isAlpha(char)) {
        let identifier = '';
        while (this.isAlpha(char) || this.isDigit(char)) {
          identifier += char;
          this.position += 1;
          char = this.input[this.position];
        }
        return new Token('IDENTIFIER', identifier);
      }

      if (this.isDigit(char)) {
        let number = '';
        while (this.isDigit(char)) {
          number += char;
          this.position += 1;
          char = this.input[this.position];
        }
        return new Token('NUMBER', parseInt(number, 10));
      }

      switch (char) {
        case '=':
          this.position += 1;
          return new Token('ASSIGN', '=');
        case '+':
          this.position += 1;
          return new Token('PLUS', '+');
        case '-':
          this.position += 1;
          return new Token('MINUS', '-');
        case '*':
          this.position += 1;
          return new Token('MULTIPLY', '*');
        case '/':
          this.position += 1;
          return new Token('DIVIDE', '/');
        case ';':
          this.position += 1;
          return new Token('SEMICOLON', ';');
        default:
          throw new Error(`Invalid character: ${char}`);
      }
    }

    return new Token('EOF', null);
  }
}
