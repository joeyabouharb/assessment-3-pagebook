/* eslint-disable no-console */
const PageRepository = require('../repository/PageRepository');

const createPage = (req, res) => {
  const pageRepository = PageRepository();
  const { Page } = req;
  console.log(Page);
  const result = pageRepository.createPage(Page);
  pageRepository.close();
  if (result.error) {
    const { status } = result;
    return res.status(status).json(result);
  }
  return res.json({ result });
};

const deletePage = (req, res) => {
  const pageRepository = PageRepository();
  const { id: pageID } = req.params;
  const result = pageRepository.deletePage({ pageID });
  pageRepository.close();
  if (result.error) {
    return res.status(result.status).json(result);
  }
  return res.json({ result });
};

const getPages = (req, res) => {
  const pageRepository = PageRepository();
  const { PageQuery } = req;
  console.log(PageQuery);
  const result = pageRepository.retrievePages(PageQuery);
  pageRepository.close();
  if (result.error) {
    return res.status(400).json(result);
  }
  return res.json({ result });
};

const getPageDetails = (req, res) => {
  const pageRepository = PageRepository();
  const { id: pageID } = req.params;
  const result = pageRepository.retrievePageInfo({ pageID });
  pageRepository.close();
  if (result.error) {
    return res.status(result.status).json(result);
  }
  return res.json({ result });
};

const updatePage = (req, res) => {
  const pageRepository = PageRepository();
  const { Page } = req;
  Page.pageID = req.params.id;
  const result = pageRepository.updatePageDetails(Page);
  pageRepository.close();
  if (result.error) {
    return res.status(result.status).json(result);
  }
  return res.json({ result });
};


module.exports = Object.freeze({
  updatePage,
  getPages,
  deletePage,
  createPage,
  getPageDetails,
});
