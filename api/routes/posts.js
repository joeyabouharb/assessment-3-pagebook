const { Router } = require('express');
const postController = require('../controllers/post');
const Posts = require('../models/posts');
const EditPosts = require('../models/editPost');
const { requiresValidation } = require('../utils/validators');
const { authorizeAccessToPage } = require('../utils/auth');

const postRouter = Router();

postRouter.post(
  '/',
  requiresValidation(Posts),
  postController.create,
  authorizeAccessToPage,
);
postRouter.get(
  '/',
  postController.getPosts,
);
postRouter.patch(
  '/:postID',
  requiresValidation(EditPosts),
  authorizeAccessToPage,
  postController.update,
);
postRouter.delete(
  '/:postID',
  postController.destroy,
  authorizeAccessToPage,
);
postRouter.get(
  '/analysis',
  authorizeAccessToPage,
  postController.getEstimatedMaxLiked,
);

module.exports = Object.freeze(postRouter);
