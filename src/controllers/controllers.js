import table from '../dictionary.js';

import { Lexer } from '../models/Lexer.js';

export const postAnalyze = async (req, res) => {
  const {
    body: { text },
  } = req;

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
        highlightedText += `<span class="highlighted-token" title="${token.color}">${token.value}</span>`;
      }

      if (token.type === 'NEW_LINE') highlightedText += '<br />';

      token = lexer.getNextToken();
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json({ data: result, text: highlightedText });
};

export const getTable = async (_, res) => {
  const originalObj = {
    symbols: {},
    keywords: {},
  };

  // Flatten objects

  Object.keys(table.symbols).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(table.symbols, key)) {
      originalObj.symbols[key] = key;
    }
  });

  Object.keys(table.keywords).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(table.keywords, key)) {
      originalObj.keywords[key] = key;
    }
  });

  res.json(originalObj);
};
