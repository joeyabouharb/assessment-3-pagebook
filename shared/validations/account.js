const constraints = {
  userName: {
    presence: true,
    format: {
      message: () => 'input not valid!',
      pattern: /^[a-zA-Z-\s]+$/,
    },
    length: {
      minimum: 3,
      maximum: 40,
    },
    type: 'string',
  },
  password: {
    presence: true,
    format: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_?])[A-Za-z\d@$!%*?&\-_?]{8,}$/,
      message: () => 'must contain 1 lower case, 1 uppercase, 1 numeric character',
    },
    length: {
      minimum: 8,
      maximum: 64,
    },
    type: 'string',
  },
  confirmPassword: {
    presence: true,
    equality: 'password',
  },
  email: {
    presence: true,
    email: {
      message: () => 'is not valid!',
    },
    length: {
      minimum: 4,
      maximum: 255,
    },
    type: 'string',
  },
};

module.exports = Object.freeze(constraints);
