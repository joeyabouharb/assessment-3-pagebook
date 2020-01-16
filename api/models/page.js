const guid = require('uuid/v4');
const validate = require('validate.js');
const constraints = require('../../shared/validations/page');

const Page = ({
  pageName, pageEmail, pageAddress, pageLocation,
  pageZip, pageState, pageCountry, pagePhone,
}) => ({
  pageName,
  pageEmail,
  pageAddress,
  pageLocation,
  pageZip,
  pageState,
  pageCountry,
  pagePhone,
  accountID: guid(),
});


const create = async (page) => {
  const result = await validate.async(page, constraints)
    .catch((error) => ({ error }));
  if (result.error) {
    return { error: result.error, status: 400 };
  }
  return Page(result);
};

module.exports = Object.freeze({
  create,
  name: Page.name,
});
