import { parse } from "../grammar.js";
import { generateTree } from "./generateTree.js";

export const syntaxAnalysis = (res, text, lexicalData) => {
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

      if (!found) {
        res.status(400).json({
          error: `(${line}:${column}) Se esperaba "${expected}"`,
          type: 'sintactico',
        });
        return;
      }

      res.status(400).json({
        error: `(${line}:${column}) Se esperaba "${expected}" pero se encontró "${found}"`,
        type: 'sintactico',
      });
      return;
    }

    res.status(500).json({
      error: e.message,
    });
  }
};
