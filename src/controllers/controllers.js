import table from '../dictionary.js';

import { Lexer } from '../models/Lexer.js';

import { parse } from '../grammar.js';
import { generateTree } from '../utilities/generateTree.js';

// ---------------------------------------
// POST
// ---------------------------------------

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
        highlightedText += `<span class="highlighted-token color-${token.color}" title="Token: ${token.type}">${token.value}</span>`;
      }

      if (token.type === 'NEW_LINE') highlightedText += '<br />';

      token = lexer.getNextToken();
    }
  } catch (error) {
    console.log('input:', text);
    console.error(error);

    return res.status(400).json({ error: error.message });
  }

  return res.json({ data: result, text: highlightedText });
};

export const postSyntaxAnalyze = async (req, res) => {
  const {
    body: { text },
  } = req;

  // TODO: Add symbols analysis here

  try {
    const data = parse(text);
    const treeData = generateTree(data);

    // TODO: Error handling?

    res.json({ tree: treeData, raw: data });
  } catch (e) {
    // How many errors at the same time?
    console.log('input:', text);
    console.error(e);

    // TODO: Improve "found" to include whole word (regex?)
    if (e.expected) {
      res.status(400).json({
        error: `Se esperaba "${e.expected[0].text}" pero se encontró "${e.found}" en la linea ${e.location.start.line} columna ${e.location.start.column}`,
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
