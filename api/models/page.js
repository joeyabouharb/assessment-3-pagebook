const guid = require('uuid/v4');
const validate = require('validate.js');
const constraints = require('../../shared/validations/page');
const { verifyJwt } = require('../utils/auth');
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
  
});


const create = async (page, token) => {
  const result = await validate.async(page, constraints)
    .then(async (res) => {
      const { accountID } = await verifyJwt(token);
      return { accountID, ...res };
    })
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
