const DatabaseClient = require('./DatabaseClient');

const pageRepository = (db = './pages.db') => {
  const client = DatabaseClient(db);

  const createPage = (page) => {
    const sql = `
    INSERT INTO PAGES(accountID, pageName, pageEmail, pageAddress,
      pageZip, pageState, pageCountry, pagePhone)
      VALUES($accountID, $pageName, $pageEmail, $pageAddress,
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

  const retrievePageInfo = (pageID) => {
    const sql = `
    SELECT p.pageName, p.pageAddress, p.pageCountry
    from Pages p
    WHERE p.pageID == $pageID
    `;
    const result = client.getOne(sql, pageID);
    if (result.error) {
      return { error: result.error, status: 400 };
    }
    return result;
  };

  const retrievePages = (pageParams, limit = 100, offset = 0) => {
    const keys = Object.keys(pageParams);
    const query = keys.map((key) => `${key} LIKE $${key}`);
    const queryStr = query.length > 0 ? `WHERE ${query.join('\nOR ')}` : '';
    const sql = `
    SELECT *
    FROM Pages p
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
    close: () => { client.close(); },
  };
};

module.exports = Object.freeze(pageRepository);
