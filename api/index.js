const express = require('express');
const helmet = require('helmet');
const accountRoute = require('./routes/accounts');
const pageRoute = require('./routes/pages');
const postRoute = require('./routes/posts');
const guestPageRoute = require('./routes/guest');
const { authNeeded } = require('./utils/auth');
const PageRepository = require('./repository/PageRepository');

const PORT = process.env.PORT || 1234;
const HOST = process.env.HOST || 'localhost';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  if (
    err instanceof SyntaxError
    && err.status === 400 && 'body' in err
  ) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.sendStatus(400); // Bad request
  }

  return next();
});

// routes
app.use('/api/accounts/:accountID/pages',
  authNeeded, pageRoute);
app.use('/api/accounts/:accountID/pages/:pageID/posts',
  authNeeded, postRoute);
app.use('/api/accounts', accountRoute);
app.use('/api/pages', guestPageRoute);

app.get('/', (req, res) => {
  const pageRepository = PageRepository();
  const result = pageRepository.retrievePages({});
  const html = result.reduce((domList, item, index) => {
    const destructured = Object.entries(item);
    const headers = index === 0
      ? destructured.reduce((dom, [key]) => `
      ${dom}
      <li style="flex: 1 1 auto; list-style-type:none;
        max-width: 150px; padding: 1rem;">
        <b>${key}:</b>
      </li>`, '')
      : '';
    const body = destructured.reduce((dom, [, value]) => `
      ${dom}
      <li style="flex: 1 1 auto; list-style-type:none;
      max-width: 150px; word-wrap: break-word; padding:1rem;">
        ${value}
      </li>`, '');
    return [
      ...domList,
      `<ul
        style="display:flex; flex-direction: row; list-style-type:none;
        justify-content: center;">
        ${headers}
      </ul>
      <ul style="display:flex; flex-direction: row;
        list-style-type:none; justify-content: center;">
        ${body}
      </ul>`,
    ];
  }, []);

  res.send(`
  <h1 style="text-align: center;">
    User Pages:
  </h1>
  <div style="display:flex; flex-direction: column; overflow-y: scroll;">
    ${html.join('')}
  </div`);
});

// 404 middleware
app.use((_, res) => {
  res.status(404);
  res.json({ error: 'requested resource Not Found!' });
});
app.listen(
  PORT,
  HOST,
  () => process.stdout.write(
    `\nlistening on http://${HOST}:${PORT}\n`,
  ),
);
