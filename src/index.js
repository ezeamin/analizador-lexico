import { Lexer } from './models/Lexer.js';

const sourceCode = 'int x = 42; y = x + 10; float z = 5.2; if (x != 10) { y = 0; }';

console.log(`Source code: ${sourceCode}\n`);

const lexer = new Lexer(sourceCode);

let token = lexer.getNextToken();
while (token.type !== 'EOF') {
  console.log(token);
  token = lexer.getNextToken();
}
