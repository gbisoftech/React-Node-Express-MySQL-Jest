const { sequelize } = require('../../config/database');
const Article = require('../../models/Article');
const User = require('../../models/User');

describe('Article Model Test', () => {
  let testUser;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create an article successfully', async () => {
    const validArticle = {
      title: 'Test Article',
      content: 'This is a test article content',
      userId: testUser.id
    };
    const article = await Article.create(validArticle);
    expect(article.title).toBe(validArticle.title);
    expect(article.content).toBe(validArticle.content);
    expect(article.userId).toBe(testUser.id);
  });

  it('should fail to create an article without required fields', async () => {
    expect.assertions(1);
    try {
      await Article.create({});
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should fail to create an article without a user', async () => {
    expect.assertions(1);
    try {
      await Article.create({
        title: 'Test Article',
        content: 'This is a test article content'
      });
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should get article with associated user', async () => {
    const article = await Article.create({
      title: 'Test Article',
      content: 'This is a test article content',
      userId: testUser.id
    });

    const foundArticle = await Article.findByPk(article.id, {
      include: [{ model: User, as: 'author' }]
    });

    expect(foundArticle.author.id).toBe(testUser.id);
    expect(foundArticle.author.name).toBe(testUser.name);
  });
}); 