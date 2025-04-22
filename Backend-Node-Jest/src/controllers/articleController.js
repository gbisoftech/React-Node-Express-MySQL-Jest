const Article = require('../models/Article');
const User = require('../models/User');

// @desc    Create new article
// @route   POST /api/articles
// @access  Private
const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const article = await Article.create({
      title,
      content,
      userId: req.user.id
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
const getArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      include: [{
        model: User,
        as: 'author',
        attributes: [ 'name']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
const getArticle = async (req, res) => {
  try {

    const article = await Article.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: [ 'name']
      }]
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check if user is the owner of the article
    if (article.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this article' });
    }

    const updatedArticle = await article.update(req.body);
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check if user is the owner of the article
    if (article.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this article' });
    }

    await article.destroy();

    res.status(200).json({ message: 'Article deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle
}; 