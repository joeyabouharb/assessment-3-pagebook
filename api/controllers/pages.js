/* eslint-disable no-console */
const PageRepository = require('../repository/PageRepository');

const createPage = (req, res) => {
  const pageRepository = PageRepository();
  const { Page } = req;
  console.log(Page);
  const result = pageRepository.createPage(Page);
  if (result.error) {
    const { status } = result;
    return res.status(status).json(result);
  }
  return res.json({ result });
};

const deletePage = (req, res) => {
  const pageRepository = PageRepository();
  const { pageID } = req;
  const result = pageRepository.deletePage({ pageID });
  if (result.error) {
    return res.status(result.status).json(result);
  }
  return res.json({ result });
};

const getPages = (req, res) => {
  const pageRepository = PageRepository();
  const { PageQuery } = req;
  const result = pageRepository.retrievePages(PageQuery);
  if (result.error) {
    return res.status(400).json(result);
  }
  return res.json({ result });
};

const getPageDetails = (req, res) => {
  const pageRepository = PageRepository();
  const { id } = req.params;
  const pageID = Number(id);
  if (!pageID || Object.is(pageID, NaN)) {
    return res.status(400).json({ error: 'no value supplied' });
  }
  console.log(pageID);
  const result = pageRepository.retrievePageInfo({ pageID });
  pageRepository.close();
  if (result.error) {
    return res.send(result.status).json(result);
  }
  return res.json({ result });
};

const updatePage = (req, res) => {
  const pageRepository = PageRepository();
  const { pageID, ...details } = req.Page;
  const result = pageRepository.updatePageDetails(details, pageID);
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
