const validate = require('validate.js');

/**
 * prepare validations on object for any entity model specified
 * @param {object} Entity
 */
const requiresValidation = (Entity) => (req, res, next) => {
  const { user } = req;
  Entity.create({ ...req.body }, user)
    .then((entity) => {
      req[Entity.name] = entity;
      next();
    })
    .catch((err) => {
      res.status(400).json(err);
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
    .catch((error) => ({ error, status: 400 }));
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
});
