const { Router } = require('express');
const PageQuery = require('../models/pageQuery');
const { requiresValidation } = require('../utils/validators');
const guestController = require('../controllers/guest');

const guestRouter = Router();

guestRouter.get('/',
  requiresValidation(PageQuery),
  guestController.getPages);

guestRouter.get('/:pageID',
  guestController.getPageDetails);

guestRouter.get('/:pageID/posts',
  guestController.getPosts);

module.exports = Object.freeze(guestRouter);
