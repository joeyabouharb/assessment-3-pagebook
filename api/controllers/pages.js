/* eslint-disable no-console */
const PageRepository = require('../repository/PageRepository');

const createPage = (req, res) => {
  const pageRepository = PageRepository();
  const { model: Page } = req;
  console.log(Page);
  const result = pageRepository.createPage(Page);
  pageRepository.close();
  if (result.error) {
    return res.status(400).json(result);
  }
  return res.json({ result: { success: true, id: Page.pageID } });
};

const deletePage = (req, res) => {
  const pageRepository = PageRepository();
  const { model: pageID } = req.params;
  const result = pageRepository.deletePage({ pageID });
  pageRepository.close();
  if (result.error) {
    return res.status(result.status).json(result);
  }
  return res.json({ result: 'success' });
};

const updatePage = (req, res) => {
  const pageRepository = PageRepository();
  const { model: Page } = req;
  console.log(Page);
  const result = pageRepository.updatePageDetails(Page);
  pageRepository.close();
  if (result.error) {
    return res.status(result.status).json(result);
  }
  return res.json({ result: 'success' });
};

const getManagedPages = (req, res) => {
  const { accountID } = req.user;
  const pageRepository = PageRepository();
  const result = pageRepository.getmanagedPages(accountID);
  return res.status(400).json({ result });
};

module.exports = Object.freeze({
  updatePage,
  deletePage,
  createPage,
  getManagedPages,
});
