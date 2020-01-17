const { Router } = require('express');
const PageController = require('../controllers/pages');
const { requiresValidation } = require('../utils/validators');
const PageQuery = require('../models/pageQuery');
const Page = require('../models/page');

const pageRouter = Router();

pageRouter.get('/', requiresValidation(PageQuery), PageController.getPages);
pageRouter.get('/:id/', PageController.getPageDetails);
pageRouter.post('/', requiresValidation(Page), PageController.createPage);
pageRouter.patch('/', requiresValidation(Page), PageController.updatePage);
pageRouter.delete('/:id/', PageController.deletePage);

module.exports = Object.freeze(pageRouter);
