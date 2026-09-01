describe('Server', () => {
  it('should pass a basic test', () => {
    expect(true).toBe(true);
  });

  it('should load the app module', () => {
    const app = require('./server');
    expect(app).toBeDefined();
  });
});
