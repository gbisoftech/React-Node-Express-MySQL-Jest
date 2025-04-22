const { sequelize } = require('../../config/database');
const User = require('../../models/User');

describe('User Model Test', () => {
  beforeAll(async () => {
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await sequelize.sync({ force: true });
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a user successfully', async () => {
    const validUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    const user = await User.create(validUser);
    expect(user.name).toBe(validUser.name);
    expect(user.email).toBe(validUser.email);
    expect(user.password).not.toBe(validUser.password); // Password should be hashed
  });

  it('should fail to create a user without required fields', async () => {
    expect.assertions(1);
    try {
      await User.create({});
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should fail to create a user with invalid email', async () => {
    expect.assertions(1);
    try {
      await User.create({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should not create a user with duplicate email', async () => {
    expect.assertions(1);
    const userData = {
      name: 'Test User',
      email: 'unique@example.com',
      password: 'password123'
    };

    await User.create(userData);

    try {
      await User.create(userData);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
}); 