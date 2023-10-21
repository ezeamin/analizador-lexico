import table from '../dictionary.js';

import { Lexer } from '../models/Lexer.js';

export const postAnalyze = async (req, res) => {
  const {
    body: { text },
  } = req;

  const lexer = new Lexer(text);

  const result = [];

  try {
    let token = lexer.getNextToken();
    while (token.type !== 'EOF') {
      result.push(token);
      token = lexer.getNextToken();
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json({ data: result });
};

export const getTable = async (req, res) => {
  res.json(table);
};
