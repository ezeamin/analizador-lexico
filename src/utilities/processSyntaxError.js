import { generateExpected } from './generateExpected.js';

export const processSyntaxError = (res, e) => {
  // use another try-catch to avoid errors in the error handler, which is complex
  try {
    if (e.expected) {
      const expected = generateExpected(e.expected);
      const line = e.location.start.line;
      const column = e.location.start.column;
      const found = e.found;
      // TODO: Improve "found" to include whole word (regex?)

      if (!found) {
        res.status(400).json({
          error: `(${line}:${column}) Se esperaba "${expected}" pero se detectó final de entrada`,
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
      type: 'sintactico',
    });
  } catch (e) {
    res.status(500).json({
      error: 'Ocurrió un error inesperado',
      type: '',
    });
  }
};
