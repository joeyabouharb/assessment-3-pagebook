const DatabaseClient = require('./DatabaseClient').pagesDb;

const pageRepository = () => {
  const client = DatabaseClient();
  const createPage = (page) => {
    const sql = `
    INSERT INTO PAGES(
      pageID, accountID, pageName, pageEmail, pageAddress,
      pageZip, pageState, pageCountry, pagePhone
    )
      VALUES(
        $pageID, $accountID, $pageName, $pageEmail, $pageAddress,
        $pageZip, $pageState, $pageCountry, $pagePhone)
    `;
    const result = client.modify(sql, page);
    if (result.error) {
      if (result.error === 'SQLITE_CONSTRAINT_UNIQUE') {
        return {
          error: 'Looks like you already created your page...',
          status: result.status,
        };
      }
      return {
        error: 'unspecified error occured',
        status: result.status,
      };
    } if (result.changes === 0) {
      return {
        error: 'could not process transaction, no changes were made',
        status: 400,
      };
    }
    return result;
  };
  const createMany = (pages) => {
    const sql = `
    INSERT INTO PAGES(
      pageID, accountID, pageName, pageEmail, pageAddress,
      pageZip, pageState, pageCountry, pagePhone
    )
      VALUES(
        $pageID, $accountID, $pageName, $pageEmail, $pageAddress,
        $pageZip, $pageState, $pageCountry, $pagePhone
      )
    `;
    const result = client.batchModify(sql, pages);
    return result;
  };

  const deletePage = (pageID) => {
    const sql = `
    DELETE FROM Pages
    WHERE pageID == $pageID
    `;
    const result = client.modify(sql, pageID);
    if (result.error) {
      return { ...result };
    } if (result.changes === 0) {
      return {
        error: 'page did not exist',
        status: 404,
      };
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
      return { ...result };
    } if (result.changes === 0) {
      return {
        error: 'no changes made', status: 400,
      };
    }
    return result;
  };

  const retrievePageInfo = (pageID) => {
    const sql = `
    SELECT p.pageName, p.pageAddress,
      p.pageCountry, p.pageZip, pageEmail,
      p.pagePhone, COUNT(f.accountID) as Followers
    from Pages p
    INNER JOIN followers f
      ON p.pageID = f.pageID 
    WHERE p.pageID == $pageID
    GROUP BY p.pageID
    `;
    const result = client.getOne(sql, { pageID });
    if (result.error) {
      return {
        ...result,
        status: 400,
      };
    }
    return result;
  };

  const retrievePages = (pageParams) => {
    const keys = Object.keys(pageParams);
    const query = keys.map((key) => `p.${key} LIKE $${key}`);
    const queryStr = query.length > 0
      ? `WHERE ${query.join('\n AND')}`
      : '';
    const sql = `
    SELECT
      p.pageID, p.pageName, p.pageEmail,
      p.pageAddress, p.pageZip, p.pageCountry,
      p.pagePhone, COUNT(f.AccountID) as followers
    FROM Pages p
    INNER JOIN Followers f
      ON p.pageID == f.PageID
    ${queryStr}
    GROUP BY p.pageName
    ORDER BY COUNT(f.AccountID) DESC
    `;
    const result = client.getAll(sql, pageParams);
    if (result.error) {
      return { ...result };
    }
    return result;
  };

  const getmanagedPages = (accountID) => {
    const sql = `
    SELECT p.pageName, p.pageID
    FROM pages p
    INNER JOIN Accounts a
      ON a.accountID == p.accountID
    WHERE a.accountID == $accountID
    `;
    const result = client.getAll(sql, { accountID });
    if (result.error) {
      return { ...result, status: 400 };
    }
    return result;
  };

  const addFollowers = (follows) => {
    const sql = `
    INSERT INTO Followers(accountID, pageID)
    VALUES($accountID, $pageID)
    `;
    return client.batchModify(sql, follows);
  };

  return Object.freeze({
    retrievePages,
    createPage,
    deletePage,
    updatePageDetails,
    retrievePageInfo,
    close: () => { client.close(); },
    getmanagedPages,
    createMany,
    addFollowers,
  });
};

module.exports = Object.freeze(pageRepository);
