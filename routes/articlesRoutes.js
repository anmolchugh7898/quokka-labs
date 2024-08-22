const express = require("express");
const { addArticle, articlesList, articleDetails, updateArticle, deleteArticle } = require("../controllers/articlesController");
const authorize = require("../middlewares/authorize");
const { addArticleValidation, updateArticleValidation } = require("../middlewares/validations");
const router = express.Router();

router.post('/', authorize(), addArticleValidation, addArticle)
router.get('/', articlesList)
router.get('/:id', articleDetails)
router.put('/:id', authorize(), updateArticleValidation, updateArticle)
router.delete('/:id', authorize(), deleteArticle)

module.exports = { articleRouter: router }