const express = require('express');
const accountRoute = require('./routes/accounts');
const pageRoute = require('./routes/pages');
const { authNeeded } = require('./utils/auth');

const PORT = process.env.PORT || 1234;
const HOST = process.env.HOST || 'localhost';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/accounts', accountRoute);
app.use('/api/pages', authNeeded, pageRoute);

// 404 middleware
app.route((_, res) => {
  res.status(404);
  res.json({ error: 'requested resource Not Found!' });
});

app.listen(PORT, HOST, () => process.stdout.write(`\nlistening on http://${HOST}:${PORT}\n`));
