const DatabaseClient = require('./DatabaseClient');

const pageRepository = (db = './pages.db') => {
  const client = DatabaseClient(db);
  const createPage = (page) => {
    const sql = `
    INSERT INTO PAGES(pageName, pageEmail, pageAddress, pageLocation,
      pageZip, pageState, pageCountry, pagePhone)
      VALUES($pageName, $pageEmail, $pageAddress, $pageLocation,
        $pageZip, $pageState, $pageCountry, $pagePhone)
    `;
    const result = client.write(sql, page);
    if (result.error) {
      return { error: result, status: 400 };
    }
    return result;
  };

  const deletePage = ({ pageID }) => {
    const sql = `
    DELETE FROM Page
    WHERE pageID == $pageID
    `;
    const result = client.write(sql, { pageID });
    if (result.error) {
      return { error: result.error, status: 400 };
    }
    return result;
  };
  const updatePageDetails = ({ ...details }, id) => {
    const sql = `
    `;
    const result = client.write(sql, { ...details, id });
    if (result.error) {
      return { error: result.error, status: 400 };
    }
    return result;
  };

  const retrievePageInfo = (query) => {
    const sql = `
    SELECT p.pageName, p.pageAddress, p.pageCountry, Count(f.accountId)
    from Pages p
    INNER JOIN followers ON
      f.pageId == p.pageId
    `;
    const result = client.getOne(sql, { ...query });
    if (result.error) {
      return { error: result.error, status: 400 };
    }
    return result;
  };

  const retrievePages = (pageParams, limit, offset) => {
    const keys = Object.keys(pageParams);
    const query = keys.map((key) => `${key} LIKE $${key}`);
    const queryStr = query.length > 0 ? `WHERE ${query.join('\nAND')}` : '';
    const sql = `
    SELECT *
    FROM Pages p
    INNER JOIN Followers f
      ON f.AccountID == p.AccountID
    ${queryStr}
    LIMIT $limit OFFSET $offset
    `;
    const result = client.getAll(sql, { ...pageParams, offset, limit });
    if (result.error) {
      return { error: result.error, status: result.code };
    }
    return result;
  };
  return {
    retrievePages,
    createPage,
    deletePage,
    updatePageDetails,
    retrievePageInfo,
  };
};

module.exports = Object.freeze(pageRepository);
