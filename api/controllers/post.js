const PostRepository = require('../repository/PostRepository');

const create = (req, res) => {
  const postRepository = PostRepository();
  const { model: Post } = req;
  const result = postRepository.createPost(Post);
  postRepository.close();
  if (result.error) {
    return res.status(result.status).json(result);
  }
  return res.json({ result: Post.postID });
};

const update = (req, res) => {
  const postRepository = PostRepository();
  const { model: Post } = req;
  const { postID } = req.params;

  const result = postRepository.modifyPost(Post, postID);
  postRepository.close();
  if (result.error) {
    return res.send(result.status).json(result);
  }
  return res.json({ result: 'success' });
};

const destroy = (req, res) => {
  const postRepository = PostRepository();
  const { postID } = req.params;
  const result = postRepository.deletePost(postID);
  postRepository.close();
  if (result.error) {
    return res.status(result.status).json(result);
  }
  return res.json({ result: 'success' });
};

const getPosts = (req, res) => {
  const pageID = req.baseUrl.split('/')[5];
  const { accountID } = req.user;
  const { isPublished = '1' } = req.query;
  const postRepository = PostRepository();
  const result = postRepository.getPostOnStatus(pageID, accountID, isPublished);
  postRepository.close();
  if (result.error) {
    return res.status(result.code).json(result);
  }
  return res.json({ result });
};

const getEstimatedMaxLiked = (req, res) => {
  const pageID = req.pagID;
  const postRepository = PostRepository();
  const result = postRepository.getMaxEstimatedLiked(pageID);
  postRepository.close();
  if (result.error) {
    return res.status(400).json(result);
  }
  return res.json({ result });
};

module.exports = Object.freeze({
  create,
  update,
  destroy,
  getPosts,
  getEstimatedMaxLiked,
});
