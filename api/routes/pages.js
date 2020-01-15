const { Router } = require('express');
const PageController = require('../controllers/pages');
const Validate = require('../utils/validators');
const PageQuery = require('../models/pageQuery');
const Page = require('../models/page');

const pageRouter = Router();

pageRouter.get('/', Validate(PageQuery), PageController.getPages);
pageRouter.get('/:pageID/', PageController.getPageDetails);
pageRouter.post('/', Validate(Page), PageController.createPage);
pageRouter.patch('/', Validate(Page), PageController.updatePage);
pageRouter.delete('/:pageID/', PageController.deletePage);

module.exports = Object.freeze(pageRouter);
