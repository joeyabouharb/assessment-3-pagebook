const DatabaseClient = require('./DatabaseClient');

const pageRepository = () => {
  const client = DatabaseClient();

  const createPage = (page) => {
    const sql = `
    INSERT INTO PAGES(pageID, accountID, pageName, pageEmail, pageAddress,
      pageZip, pageState, pageCountry, pagePhone)
      VALUES($pageID, $accountID, $pageName, $pageEmail, $pageAddress,
        $pageZip, $pageState, $pageCountry, $pagePhone)
    `;
    const result = client.modify(sql, page);
    if (result.error) {
      if (result.error === 'SQLITE_CONSTRAINT_UNIQUE' && result.column === 'accountID') {
        return { error: 'Looks like you already created your page...', status: result.status };
      }
      return { error: 'unspecified error occured', status: result.status };
    }
    return result;
  };

  const deletePage = (pageID) => {
    const sql = `
    DELETE FROM Pages
    WHERE pageID == $pageID
    `;
    const result = client.modify(sql, pageID);
    if (result.error) {
      return { error: result.error, status: result.status };
    } if (result.changes === 0) {
      return { error: 'page did not exist', status: 404 };
    }
    return result;
  };
  const updatePageDetails = (page) => {
    const sql = `
    UPDATE Pages
    SET
    pageName = $pageName,
    pageEmail = $pageEmail,
    pageAddress = $pageAddress,
    pageZip = $pageZip,
    pageState = $pageState,
    pageCountry = $pageCountry,
    pagePhone = $pagePhone
    WHERE pageID = $pageID
    `;
    const result = client.modify(sql, page);
    if (result.error) {
      return { error: result.error, status: result.status };
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
      return { error: result.error, status: result.status };
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
      return { error: result.error, status: result.status };
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
