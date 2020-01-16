/* eslint-disable no-console */
const Validate = (Entity) => (req, res, next) => {
  const { user } = req;
  console.log(user);
  Entity.create({ ...req.body }, user)
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
