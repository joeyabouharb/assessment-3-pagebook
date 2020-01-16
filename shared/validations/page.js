const constraints = {
  pageName: {
    presence: true,
    format: {
      pattern: /^[\w\s-:.'",!&()/\/]+$/,
      message: () => 'contains invalid characters, only alphanumeric letters and standard punctuation',
      length: {
        minimum: 1,
        maximum: 40,
      },
      type: 'string',
    },
  },
  pageEmail: {
    presence: true,
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
    presence: true,
    format: {
      pattern: /^\d{1,5}(\s|\/\d )(\w+\s\w+).+$/,
    },
    length: {
      minimum: 4,
      maximum: 50,
    },
    type: 'string',
  },
  pageZip: {
    presence: true,
    format: {
      pattern: /^\d{4,10}$/,
    },
    length: {
      minimum: 4,
      maximum: 10,
    },
  },
  pageState: {
    presence: true,
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
    presence: true,
    format: {
      pattern: /^[\w-]+$/,
    },
    type: 'string',
    length: {
      minimum: 2,
      maximum: 40,
    },
  },
  pagePhone: {
    presence: true,
    format: {
      pattern: /^[a-zA-Z0-9-\s]+$/,
    },
    length: {
      minimum: 8,
      maximum: 15,
    },
  },
};

module.exports = Object.freeze(constraints);
