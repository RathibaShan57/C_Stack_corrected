import { describe, expect, it } from '@jest/globals';
import { registrationError } from './member';

describe('registrationError', () => {
  it('rejects a short password', () => {
    expect(
      registrationError({
        email: 'member@westcoast.example',
        fullName: 'Alex Rivera',
        password: 'short',
      }),
    ).not.toBeNull();
  });
});
