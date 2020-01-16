const fs = require('fs');
const pagesDBClient = require('../api/repository/DatabaseClient');

const readFile = (filename) => new Promise((resolve, reject) => {
  fs.readFile(filename, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data.toString('utf-8'));
    }
  });
});

const up = async (file, schema) => {
  const sql = await readFile(schema)
    .catch((err) => { throw err; });
  const result = pagesDBClient(file).execute(sql);
  return result;
};

const down = async (file) => {
  const message = await new Promise((resolve, reject) => {
    fs.unlink(file, (err) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(`deleted ${file}`);
      }
    });
  })
    .catch((err) => err);
  return message;
};

const seed = () => {

};

const commandList = async () => {
  const commands = await readFile('cli/commands.json')
    .then((text) => JSON.parse(text))
    .catch((err) => { throw err; });
  const msg = Object.entries(commands)
    .reduce((result, [key, value]) => [
      ...result, `${key}${value}`,
    ], []);
  return msg.join('\n');
};

const exec = () => {
  const command = process.argv[2];
  const file = process.argv[3];
  if (command === '--up') {
    const schema = process.argv[4];
    return !schema
      ? commandList()
      : up(file, schema);
  }
  if (command === '--down') {
    return down(file);
  }
  if (command === '--seed') {
    const mockup = process.argv[4];
    return !mockup
      ? commandList()
      : seed(file, mockup);
  }
  return commandList();
};

(async () => {
  const result = await exec();
  process.stdout.write(result);
})();
