const PostRepository = require('../repository/PostRepository');
const PageRepository = require('../repository/PageRepository');

const getPosts = (req, res) => {
  const postRepository = PostRepository();
  const { pageID } = req.params;
  const result = postRepository.getPublished(pageID);
  postRepository.close();
  if (result.error) {
    return res.status(result.status).json(result);
  }
  return res.json({ result });
};

const getPageDetails = (req, res) => {
  const pageRepository = PageRepository();
  const { pageID } = req.params;
  const result = pageRepository.retrievePageInfo(pageID);
  pageRepository.close();
  if (result.error) {
    return res.status(result.status).json(result);
  }
  return res.json({ result });
};

const getPages = (req, res) => {
  const pageRepository = PageRepository();
  const { model: PageQuery } = req;
  const result = pageRepository.retrievePages(PageQuery);
  pageRepository.close();
  if (result.error) {
    return res.status(400).json(result);
  }
  return res.json({ result });
};

module.exports = Object.freeze({
  getPosts,
  getPageDetails,
  getPages,
});
