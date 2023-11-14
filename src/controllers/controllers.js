import table from '../dictionary.js';

import { lexicalAnalysis } from '../utilities/lexicalAnalysis.js';
import { syntaxAnalysis } from '../utilities/syntaxAnalysis.js';

// ---------------------------------------
// POST
// ---------------------------------------

export const postAnalyze = async (req, res) => {
  const {
    body: { text },
  } = req;

  let lexicalData;

  // 1st: Lexical analysis
  try {
    lexicalData = lexicalAnalysis(text, res);
  } catch (_) {
    return;
  }

  // 2nd: Syntax analysis
  syntaxAnalysis(res, text, lexicalData);
};

// ---------------------------------------
// GET
// ---------------------------------------

export const getTable = async (_, res) => {
  const originalObj = {
    symbols: {},
    keywords: {},
  };

  // Flatten objects

  Object.keys(table.symbols).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(table.symbols, key)) {
      originalObj.symbols[key] = table.symbols[key].value;
    }
  });

  Object.keys(table.keywords).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(table.keywords, key)) {
      originalObj.keywords[key] = table.keywords[key].value;
    }
  });

  res.json(originalObj);
};
