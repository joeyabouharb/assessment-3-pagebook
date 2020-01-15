const constraints = {
  userName: {
    presence: true,
    format: {
      pattern: /^[a-zA-Z-\s]+$/,
      message: () => 'input not valid'
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
      pattern: /^.{8,64}$/,
      message: () => 'input not valid'
    },
    length: {
      minimum: 8,
      maximum: 64,
    },
    type: 'string',
  }
}

module.exports = Object.freeze(constraints);
