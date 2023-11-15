// filter only literal and others, and then remove duplicates
export const generateExpected = (original) => {
  const expectedElements = original
    .filter((el) => el.type === 'literal' || el.type === 'other')
    .map((el) => ({ ...el, text: el.text || el.description }))
    .reduce((unique, el) => {
      return unique.some((el2) => el2.text === el.text)
        ? unique
        : [...unique, el];
    }, []);

  const expected = expectedElements
    .map((el) => {
      let text = el.text;

      switch (text) {
        case '\n':
          text = '\\n';
          break;
        case '':
          text = 'EOF';
          break;
        case 'whitespace':
        case ' ':
        case '_':
          text = 'espacio en blanco';
          break;
        default:
          break;
      }

      return text;
    })
    .join('", "');

  return expected;
};
