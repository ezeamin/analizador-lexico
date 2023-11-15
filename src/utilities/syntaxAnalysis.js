import { parse } from '../grammar.js';

import { generateTree } from './generateTree.js';
import { processSyntaxError } from './processSyntaxError.js';

export const syntaxAnalysis = (res, text, lexicalData) => {
  try {
    const data = parse(text);
    const treeData = generateTree(data);

    res.json({ ...lexicalData, tree: treeData });
  } catch (e) {
    console.log('input:', text);
    console.error(e);

    processSyntaxError(res, e);
  }
};
