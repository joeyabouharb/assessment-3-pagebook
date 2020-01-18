const validate = require('validate.js');
const guid = require('uuid/v4');

const Posts = () => ({
  postContent: {
    presence: true,
    type: 'string',
    length: {
      minimum: 1,
    },
  },
  pageID: {
    presence: true,
    type: 'string',
    length: {
      minimum: 1,
    },
  },
});

const create = async (content) => {
  const post = await validate.async(content, Posts())
    .then((postContent) => ({
      postContent, postID: guid(), postCreated: new Date().toLocaleString(), isPublished: 0,
    }));
  if (post.error) {
    return Promise.reject(post);
  }
  return post;
};

module.exports = Object.freeze({
  create,
  name: Posts.name,
});
