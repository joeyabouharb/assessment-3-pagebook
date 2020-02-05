/* eslint-disable no-console */
const faker = require('faker');
const Account = require('../api/models/account');
const Page = require('../api/models/page');
const Post = require('../api/models/posts');
const accountRepository = require('../api/repository/AccountRepository')();
const pageRepository = require('../api/repository/PageRepository')();
const postRepository = require('../api/repository/PostRepository')();

const password = 'Test-1234'; // default password for all users :)
const length = 200;
faker.seed(length);

const seed = async () => {
  const accounts = Array.from({ length }, () => Account.create({
    userName: `${faker.name.firstName()}${faker.name.lastName()}`,
    password,
    confirmPassword: password,
    email: faker.internet.email(),
  }));
  const accountIDs = await Promise.all(accounts.map(async (acc) => {
    const id = await acc.then(({ accountID }) => accountID);
    return id;
  }));
  const pages = await Array.from({ length }, () => Page.create({
    pageName: faker.random.words(4),
    pageEmail: faker.internet.email(),
    pageAddress: faker.address.streetAddress(),
    pageZip: faker.address.zipCode(),
    pageState: faker.address.stateAbbr(),
    pageCountry: faker.address.country(),
    pagePhone: '042234931',
  }, { accountID: accountIDs[Math.floor(Math.random() * length)] }));

  const pageIDs = await Promise.all(pages.map(async (pges) => {
    const id = await pges.then(({ pageID }) => pageID);
    return id;
  }));
  const randomStr = () => `<h1>${faker.random.words(4)}</h1><p>${faker.random.words(50)}</p>`;

  const posts = await Array.from({ length: length * 2 }, () => Post.create({
    postContent: randomStr(),
    isPublished: Math.floor(Math.random() * 2).toString(),
  }, pageIDs[Math.floor(Math.random() * length)]));

  const postIDs = await Promise.all(posts.map(async (p) => {
    const id = await p.then(({ postID }) => postID);
    return id;
  })).catch(console.error);

  const random = (num) => Math.floor(Math.random() * num);
  const results = ['good', 'bad', 'ugly', 'great', 'neutral'];

  const analyses = await Array.from({ length }, (v, k) => ({
    postID: postIDs[k],
    results: results[random(5)],
    confidence: random(6),
    estimatedLikes: faker.random.number().toString(),
  }));

  const followers = await Array.from({ length }, () => ({
    accountID: accountIDs[Math.floor(Math.random() * length)],
    pageID: pageIDs[Math.floor(Math.random() * length)],
  }));

  await Promise.all(accounts)
    .then(accountRepository.registerMany)
    .then(() => console.log('success writing Accounts'))
    .catch(console.error);

  await Promise.all(pages)
    .then(pageRepository.createMany)
    .then(() => console.log('success'))
    .catch(console.error);

  await Promise.all(posts)
    .then(postRepository.createMany)
    .then(() => console.log('success'))
    .catch(console.error);

  await postRepository.createBatchPostAnalysis(analyses).catch(console.error);
  await pageRepository.addFollowers(followers).catch(console.error);
};

module.exports = Object.freeze(seed);
