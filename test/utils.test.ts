import { expect, test } from 'vitest';
import { dither } from '../src/utils';

test('dither(0) 100 times', () => {
  [...Array(100)].forEach(() => {
    const result = dither(0);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(15);
  });
});

test('dither(255) 100 times', () => {
  [...Array(100)].forEach(() => {
    const result = dither(255);
    expect(result).toBeGreaterThanOrEqual(255 - 15);
    expect(result).toBeLessThanOrEqual(255);
  });
});
