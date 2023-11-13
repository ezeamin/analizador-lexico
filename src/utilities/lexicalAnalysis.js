import { Lexer } from '../models/Lexer.js';

export const lexicalAnalysis = (text) => {
  const lexer = new Lexer(text);

  const result = [];
  let highlightedText = '';

  try {
    let token = lexer.getNextToken();
    while (token.type !== 'EOF') {
      // Valid token - save it
      if (token.type !== 'NEW_LINE' && token.type !== 'SPACE') {
        result.push(token);
      }

      // Only for highlighting purposes
      if (token.type === 'SPACE') highlightedText += '&nbsp;';
      else {
        highlightedText += `<span class="highlighted-token color-${token.color}" title="Token: ${token.type}">${token.value}</span>`;
      }

      if (token.type === 'NEW_LINE') highlightedText += '<br />';

      token = lexer.getNextToken();
    }
  } catch (error) {
    console.log('input:', text);
    console.error(error);

    throw new Error(error.message);
  }

  return { lexicalAnalysis: result, text: highlightedText };
};
