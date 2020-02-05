const guid = require('uuid/v4');
const { validateBody } = require('../utils/validators');

const Page = () => ({
  pageName: {
    presence: { allowEmpty: false },
    format: {
      pattern: /^[\w\s-:.'",!&()/\\]+$/,
      message: () => 'contains invalid characters, only alphanumeric letters and standard punctuation',
      length: {
        minimum: 1,
        maximum: 40,
      },
      type: 'string',
    },
  },
  pageEmail: {
    presence: { allowEmpty: false },
    email: {
      message: () => 'is not valid',
    },
    length: {
      minimum: 4,
      maximum: 255,
    },
    type: 'string',

  },
  pageAddress: {
    presence: { allowEmpty: false },
    length: {
      minimum: 4,
      maximum: 100,
    },
    type: 'string',
  },
  pageZip: {
    presence: { allowEmpty: false },
    format: {
      pattern: /^[\d-]*$/,
    },
    length: {
      maximum: 10,
    },
  },
  pageState: {
    presence: { allowEmpty: false },
    format: {
      pattern: /^[\w-]+$/,
    },
    type: 'string',
    length: {
      minimum: 2,
      maximum: 40,
    },
  },
  pageCountry: {
    presence: { allowEmpty: false },
    type: 'string',
    length: {
      minimum: 2,
      maximum: 80,
    },
  },
  pagePhone: {
    presence: { allowEmpty: false },
    format: {
      pattern: /^[-+0-9\s]*$/,
    },
    length: {
      minimum: 8,
      maximum: 20,
    },
  },
});

const create = async (page, { accountID, pageID = guid() }) => {
  const newPage = await validateBody(page, Page());
  if (newPage.error) {
    return Promise.reject(newPage);
  }
  return { ...newPage, accountID, pageID };
};
module.exports = Object.freeze({
  create,
  name: Page.name,
});
