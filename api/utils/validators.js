const validate = require('validate.js');

/**
 * prepare validations on object for any entity model specified
 * @param {object} Entity
 */
const requiresValidation = (Entity) => (req, res, next) => {
  Entity.create({ ...req.body }, { ...req.params, ...req.user })
    .then((entity) => {
      req.model = entity;
      return next();
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err.message);
      res.status(400).json({ err });
    });
};
/**
 * validate user input in request body, given constraints
 * @param {any} body
 * @param {any} constraints
 */
const validateBody = async (body, constraints) => {
  const result = await validate.async({ ...body }, constraints)
    .then((data) => validate.cleanAttributes(data, constraints))
    .catch((error) => ({ error }));
  return result;
};

const queryValidation = async (body, constraints) => {
  const result = await validate.async({ ...body }, constraints)
    .catch((error) => ({ error }));
  return result;
};

/**
 * insert wildcards for each paramater for query support
 *
 * @param {any} params
 * @returns { object } object
 */
const validateQuery = (query) => Object.entries(query)
  .reduce((obj, [key, value]) => ({
    ...obj, [key]: `%${value}%`,
  }), {});

module.exports = Object.freeze({
  requiresValidation,
  validateBody,
  validateQuery,
  queryValidation,
});
