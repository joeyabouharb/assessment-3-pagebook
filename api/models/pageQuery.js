const constraints = require('../../shared/validations/pageQuery');
const { validateBody, validateQuery } = require('../utils/validators');

const PageQuery = ({
  pageName, pageEmail, pageAddress,
  pageZip, pageState, pageCountry, pagePhone,
}) => ({
  pageName,
  pageEmail,
  pageAddress,
  pageZip,
  pageState,
  pageCountry,
  pagePhone,
});

const create = async (page) => {
  // console.log(page);
  const result = await validateBody(page, constraints);
  if (result.error) {
    return Promise.reject(result);
  }
  const params = PageQuery(page);
  // filter out and create a new object with filled entries.
  const pageParams = validateQuery(params);
  return pageParams;
};

module.exports = Object.freeze({
  create,
  name: PageQuery.name,
});
