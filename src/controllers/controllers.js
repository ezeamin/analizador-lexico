import table from '../dictionary.js';

import { parse } from '../grammar.js';
import { generateTree } from '../utilities/generateTree.js';
import { lexicalAnalysis } from '../utilities/lexicalAnalysis.js';

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
    lexicalData = lexicalAnalysis(text);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  // 2nd: Syntax analysis
  try {
    const data = parse(text);
    const treeData = generateTree(data);

    res.json({ ...lexicalData, tree: treeData });
  } catch (e) {
    console.log('input:', text);
    console.error(e);

    // TODO: Improve "found" to include whole word (regex?)
    if (e.expected) {
      const expectedElements = e.expected.filter((el) => el.type === 'literal');
      const expected = expectedElements.map((el) => el.text).join('", "');
      const line = e.location.start.line;
      const column = e.location.start.column;
      const found = e.found;

      res.status(400).json({
        error: `Error Sintáctico - (${line}:${column}) Se esperaba "${expected}" pero se encontró "${found}"`,
      });
      return;
    }

    res.status(500).json({
      error: e.message,
    });
  }
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
