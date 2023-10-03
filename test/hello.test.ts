import { describe, it } from 'mocha'
import { expect } from 'chai';
import { hello } from '../src';

describe('hello', () => {
  it('returns hello world when called without a param', () => {
    expect(hello.makeHello()).to.equal('Hello world');
  });
  it('returns hello world when called with an empty string', () => {
    expect(hello.makeHello('')).to.equal('Hello world');
  });
  it('returns hello bob when given the name bob', () => {
    expect(hello.makeHello('bob')).to.equal('Hello bob');
  });
});
