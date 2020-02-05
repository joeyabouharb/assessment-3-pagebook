const guid = require('uuid/v4');
const { validateBody } = require('../utils/validators');

const Posts = () => ({
  postContent: {
    presence: { allowEmpty: false },
    type: 'string',
    length: {
      minimum: 1,
      maximum: 1000,
    },
  },
  isPublished: {
    presence: { allowEmpty: false },
    format: {
      pattern: /[01]/,
    },
  },
  pageID: {
    presence: true,
  },
});

const create = async (content, { pageID }) => {
  const post = await validateBody(content, Posts());
  if (post.error) {
    return Promise.reject(post);
  }
  const postID = guid();
  return {
    ...post, postID, postCreated: new Date().toISOString(),
  };
};

module.exports = Object.freeze({
  create,
  name: Posts.name,
});
