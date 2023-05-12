import { ResponseCountPipe } from './response-count.pipe';

describe('ResponseCountPipe', () => {
  it('create an instance', () => {
    const pipe = new ResponseCountPipe();
    expect(pipe).toBeTruthy();
  });
});
