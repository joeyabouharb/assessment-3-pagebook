const pagesDBClient = require('../api/repository/DatabaseClient');
const fs = require('fs');

const readFile = (filename) => new Promise((resolve, reject) => {
  fs.readFile(filename, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data.toString('utf-8'));
    }
  });
});

const up  = async (file, schema) => {
  const sql = await readFile(schema);
  pagesDBClient(file).execute(sql);
  return `created database ${file}`;
}

const down = async (file) => {
  const message = await new Promise((resolve, reject) => {
    fs.unlink(file, (err) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(`deleted ${file}`)
      }
    });
  })
  .catch(err => err);
  return message;
}

const seed = (file, mockup) => {

}

const commandList = () => {
  const commands = {
    "info:": "\n\tthis application helps you create delete and seed databases\n",
    "commands:": "",
      "\t--help": "\n\t\tdisplays this helpful prompt",
      "\t--up FILE": "\n\t\tcreate the database using the schema from the specified file location",
      "\t--down FILE": "\n\t\tdelete the database file from the specified file location",
      "\t--seed FILE MOCKUP": "\n\t\tseed the specified file database with specified mockup"

  }
  const msg = []
  for (const [key, value] of Object.entries(commands)) {
    msg.push(`${key}${value}`)
  }
  return msg.join("\n");
}

const exec = () => {
  const command = process.argv[2]
  const file = process.argv[3];
  if(command === '--up') {
    const schema = process.argv[4];
    return !schema
      ? commandList()
      : up(file, schema);
  }
  if(command === '--down') {
    return down(file);
  }
  if(command === '--seed') {
    const mockup = process.argv[4];
    return (
      !mockup
      ? commandList()
      : seed(file, mockup)
    );
  } 
  return commandList;
};

(async () => {
  const result = await exec();
  console.log(result);
})();