const { sequelize } = require('../../config/database');
const {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle
} = require('../../controllers/articleController');
const Article = require('../../models/Article');
const User = require('../../models/User');

describe('Article Controller', () => {
  let mockReq;
  let mockRes;
  let testUser;

  beforeAll(async () => {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { id: testUser.id }
    };
    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn()
    };
  });

  describe('createArticle', () => {
    it('should create a new article', async () => {
      mockReq.body = {
        title: 'Test Article',
        content: 'Test content'
      };

      await createArticle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Article',
          content: 'Test content',
          userId: testUser.id
        })
      );
    });
  });

  describe('getArticles', () => {
    beforeEach(async () => {
      await Article.create({
        title: 'Article 1',
        content: 'content 1',
        userId: testUser.id
      });
      await Article.create({
        title: 'Article 2',
        content: 'content 2',
        userId: testUser.id
      });
    });

    it('should get all articles', async () => {
      await getArticles(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            title: expect.any(String),
            content: expect.any(String),
            userId: testUser.id
          })
        ])
      );
    });
  });

  describe('getArticle', () => {
    let testArticle;

    beforeEach(async () => {
      testArticle = await Article.create({
        title: 'Test Article',
        content: 'Test content',
        userId: testUser.id
      });
      mockReq.params = { id: testArticle.id };
    });

    it('should get article by id', async () => {
      await getArticle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: testArticle.id,
          title: 'Test Article',
          content: 'Test content'
        })
      );
    });

    it('should return 404 for non-existent article', async () => {
      mockReq.params.id = 99999;
      await getArticle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Article not found'
      });
    });
  });

  describe('updateArticle', () => {
    let testArticle;

    beforeEach(async () => {
      testArticle = await Article.create({
        title: 'Original Title',
        content: 'Original content',
        userId: testUser.id
      });
      mockReq.params = { id: testArticle.id };
      mockReq.body = {
        title: 'Updated Title',
        content: 'Updated content'
      };
    });

    it('should update article', async () => {
      await updateArticle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Updated Title',
          content: 'Updated content'
        })
      );
    });
  });

  describe('deleteArticle', () => {
    let testArticle;

    beforeEach(async () => {
      testArticle = await Article.create({
        title: 'To Delete',
        content: 'content to delete',
        userId: testUser.id
      });
      mockReq.params = { id: testArticle.id };
    });

    it('should delete article', async () => {
      await deleteArticle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Article deleted'
      });

      const deletedArticle = await Article.findByPk(testArticle.id);
      expect(deletedArticle).toBeNull();
    });
  });
}); 