jest.autoMockOff();

const babel = require('babel-core');
const unpad = require('../../utils/unpad');

function transform(code) {
  return babel.transform(code,  {
    plugins: [require('../index')],
  }).code;
}

describe('constant-folding-plugin', () => {
  it('should evaluate some expressions', () => {
    const source = unpad(`
      "a" + "b"
      2 * 3;
      1/3;
      4 | 3;
      a(), b();
      var x = 1;
      foo(x);
      "b" + a + "c" + "d" + g + z + "f" + "h" + "z"
    `);

    const expected = unpad(`
      "ab";
      6;
      1 / 3;
      7;
      a(), b();
      var x = 1;
      foo(x);
      "b" + a + "cd" + g + z + "fhz";
    `);
    expect(transform(source)).toBe(expected);
  });
});
