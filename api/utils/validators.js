const Validate = (Entity) => (req, res, next) => {
  Entity.create({ ...req.body })
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
