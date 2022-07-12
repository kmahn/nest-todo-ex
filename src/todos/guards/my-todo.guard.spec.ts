import { MyTodoGuard } from './my-todo.guard';

describe('MyTodoGuard', () => {
  it('should be defined', () => {
    expect(new MyTodoGuard()).toBeDefined();
  });
});
