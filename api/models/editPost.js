const { validateBody } = require('../utils/validators');

const Posts = () => ({
  postContent: {
    presence: { allowEmpty: false },
    type: 'string',
    format: {
      pattern: /[-!@#$%^&*()_+,?;'"{}\[\]\|`~:a-zA-Z\s<>/0-9]+/,
    },
    length: {
      minimum: 1,
    },
  },
  isPublished: {
    presence: { allowEmpty: false },
    format: {
      pattern: /[01]/,
    },
  },
});

const create = async (content) => {
  const post = await validateBody(content, Posts());
  if (post.error) {
    return Promise.reject(post);
  }
  return post;
};

module.exports = Object.freeze({
  create,
  name: Posts.name,
});
