import assert from 'node:assert/strict';

function deskQuote(visits) {
  let total = 0;
  for (let i = 0; i < visits; i += 1) {
    total += i % 2 === 0 ? 18 : 22;
  }
  return total;
}

describe('deskQuote', () => {
  it('charges mixed peak rates', () => {
    assert.equal(deskQuote(4), 80);
  });
});
