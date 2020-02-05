const constraints = {
  pageName: {
    format: {
      pattern: /^[\w\s0-9-_!:'".]+$/,
      message: () => (
        'contains invalid characters, only alphanumeric letters and standard punctuation'
      ),
      length: {
        minimum: 1,
        maximum: 40,
      },
      type: 'string',
    },
  },
  pageEmail: {
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
    format: {
      pattern: /^[\d\s\w+!-]+$/,
    },
    length: {
      minimum: 1,
      maximum: 50,
    },
    type: 'string',
  },
  pageZip: {
    format: {
      pattern: /^d{4,10}$/,
    },
    length: {
      minimum: 4,
      maximum: 10,
    },
  },
  pageState: {
    format: {
      pattern: /^[\w-]$/,
    },
    type: 'string',
  },
  pageCountry: {
    format: {
      pattern: /^[\w-]$/,
    },
    type: 'string',
  },
  pagePhone: {
    format: {
      pattern: /^[0-9+/s]$/,
    },
    length: {
      minimum: 8,
      maximum: 15,
    },
  },
};

module.exports = Object.freeze(constraints);
