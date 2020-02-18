const { Router } = require('express');
const PageController = require('../controllers/pages');
const { requiresValidation } = require('../utils/validators');
const { authorizeAccessToPage } = require('../utils/auth');
const Page = require('../models/page');
const GuestController = require('../controllers/guest');

const pageRouter = Router();

pageRouter.post(
  '/',
  requiresValidation(Page),
  authorizeAccessToPage,
  PageController.createPage,
);

pageRouter.patch(
  '/:pageID',
  requiresValidation(Page),
  authorizeAccessToPage,
  PageController.updatePage,
);

pageRouter.delete(
  '/:pageID',
  authorizeAccessToPage,
  PageController.deletePage,
);

pageRouter.get('/', PageController.getManagedPages);
pageRouter.get('/:pageID', GuestController.getPageDetails);
module.exports = Object.freeze(pageRouter);
