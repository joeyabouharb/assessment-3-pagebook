const guid = require('uuid/v4');
const constraints = require('../../shared/validations/page');
const { validateBody } = require('../utils/validators');

const Page = ({
  accountID, pageName, pageEmail, pageAddress,
  pageZip, pageState, pageCountry, pagePhone,
}) => ({
  accountID,
  pageName,
  pageEmail,
  pageAddress,
  pageZip,
  pageState,
  pageCountry,
  pagePhone,
  pageID: guid(),
});

const create = async (page, { accountID }) => {
  const result = await validateBody(page, constraints);
  if (result.error) {
    return Promise.reject(result);
  }
  return Page({ ...result, accountID });
};

module.exports = Object.freeze({
  create,
  name: Page.name,
});
