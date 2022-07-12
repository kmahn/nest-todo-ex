import { JwtExceptionFilter } from './jwt-exception.filter';

describe('HttpFilter', () => {
  it('should be defined', () => {
    expect(new JwtExceptionFilter()).toBeDefined();
  });
});
