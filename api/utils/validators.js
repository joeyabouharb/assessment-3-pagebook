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
      res.status(err.status).json(err);
    });
};
/**
 * validate user input in request body, given constraints
 * @param {any} body
 * @param {any} constraints
 */
const validateBody = async (body, constraints) => {
  const result = await validate.async({ ...body }, constraints)
    .catch((error) => ({ error, status: 400 }));
  return result;
};

/**
 * strip any undefined parameters in parameter object
 *
 * @param {any} params
 * @returns { object } object
 */
const validateQuery = (params) => Object.entries(params)
  .filter(([, value]) => value !== undefined)
  .reduce((obj, [key, value]) => ({
    ...obj, [key]: `%${value}%`,
  }), {});

module.exports = Object.freeze({
  requiresValidation,
  validateBody,
  validateQuery,
});
