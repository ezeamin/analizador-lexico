import { Lexer } from './models/Lexer';

const sourceCode = 'int x = 42; y = x + 10;';

const lexer = new Lexer(sourceCode);

let token = lexer.getNextToken();
while (token.type !== 'EOF') {
  console.log(token);
  token = lexer.getNextToken();
}
