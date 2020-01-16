const validate = require('validate.js');
const constraints = require('../../shared/validations/pageQuery');

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
  const result = await validate.async(page, constraints)
    .catch((error) => ({ error }));
  if (result.error) {
    return { error: result.error, status: 400 };
  }
  const params = PageQuery(page);
  // filter out and create a new object with filled entries.
  const pageParams = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .reduce((obj, [key, value]) => ({
      ...obj, [key]: `%${value}%`,
    }), {});
  return { pageParams };
};

module.exports = Object.freeze({
  create,
  name: PageQuery.name,
});
