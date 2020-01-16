/* eslint-disable no-console */
const Validate = (Entity) => (req, res, next) => {
  const { authorization = ' ' } = req.headers;
  const [, token] = authorization.split(' ');
  console.log(token);
  Entity.create({ ...req.body }, token)
    .then(({ error, status, ...entity }) => {
      if (error) {
        res.status(status);
        res.json(error);
      } else {
        req[Entity.name] = entity;
        next();
      }
    });
};

module.exports = Object.freeze(Validate);
