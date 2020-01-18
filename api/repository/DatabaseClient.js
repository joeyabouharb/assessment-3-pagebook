/* eslint-disable no-console */
/**
 * Creates a connection to a database to handle read/write access.
 *
 */
const SqliteDB = require('better-sqlite3');

/**
 * factory function:
 *
 * produces a connection to an SQL database with basic CRUD operations
 * @param {string} connection
 */
const dbClient = (connection = './pages.db', key = 'MYSECRETPASSKEY') => {
  const client = new SqliteDB(connection);
  client.pragma(`KEY = ${key}`);

  // load up regular expression server into sqlite
  // client.loadExtension('/usr/lib/sqlite3/pcre.so');
  /**
   * insert new entry into database
   * @param {string} sql
   * @param {any} params
   */

  const modify = (sql, params) => {
    try {
      return client
        .prepare(sql)
        .run(params);
    } catch (error) {
      console.log(error);
      const { code, message } = error;
      // const [, errorOn] = message.split(': ');
      // const [, column] = errorOn.split('.');
      return { error: code, column: message, status: 400 };
    }
  };

  /**
   * execute multiple sql queries ( usually read from a file)
   * needed for creating/ seeding new entities in the database
   *
   * ***use in CLI only!!***
   *
   * @param {string} sql
   */
  const execute = (sql) => {
    try {
      client.exec(sql);
      return { result: 'success' };
    } catch (err) {
      return err;
    }
  };

  /**
   * get the first result returned from an sql query
   * @param {string} sql
   * @param {object} params
   */
  const getOne = (sql, params) => {
    const query = client.prepare(sql);
    try {
      const results = query.get(params);
      return results || { error: 'not found', status: 404 };
    } catch (err) {
      return { error: 'unspecified error occured during transaction', status: 500 };
    }
  };

  /**
   *
   * get all the results from an sql query
   * @param {string} sql
   * @param {object} params
   */
  const getAll = (sql, { offset, limit, ...pageParams }) => {
    try {
      const query = client.prepare(sql);
      const results = query.all({ ...pageParams, limit, offset });
      return results.length > 0 ? results : { error: (entity) => `${entity}s not found`, status: 404 };
    } catch (error) {
      console.log(error);
      return { error: 'something bad happenned during the transaction', code: 400 };
    }
  };

  /**
   * close database connection once all queries have been executed
   */
  const close = () => client.close();

  /**
   *
   * executes an sql query with a custom defined aggregate function
   *
   * @param {any} param0 - custom aggregate function
   * @param {string} sql - sql query
   *
   */
  const aggregate = ({ name, options }, sql) => {
    try {
      client.aggregate(name, options);
      const results = client.prepare(sql);
      return results > 0 ? results : { error: 'not found', status: 404 };
    } catch (error) {
      return { error: 'an error occured during the transaction', status: 400 };
    }
  };

  return {
    getOne,
    getAll,
    modify,
    execute,
    close,
    aggregate,
  };
};
module.exports = Object.freeze(dbClient);
