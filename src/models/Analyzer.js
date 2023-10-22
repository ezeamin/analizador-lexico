export class Analyzer {
  static isWhiteSpace(char) {
    return /\s/.test(char);
  }

  static isNewLine(char) {
    return /\n/.test(char);
  }

  static isAlpha(char) {
    return /[a-zA-Z_]/.test(char);
  }

  static isDigit(char) {
    return /\d/.test(char);
  }

  static isEOF(char) {
    return char === undefined;
  }
}
