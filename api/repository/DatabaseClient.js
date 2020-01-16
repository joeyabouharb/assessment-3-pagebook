/**
 * Creates a connection to a database to handle read/write access.
 * returns results as a Promise
 */
const SqliteDB = require('better-sqlite3');
/**
 * factory function:
 *
 * produces a connection to an SQL database with basic CRUD operations
 * @param {string} connection
 */
const dbClient = (connection) => {
  const client = new SqliteDB(connection);
  /**
   * insert new entry into database
   * @param {string} sql
   * @param {any} params
   */

  const write = (sql, params) => {
    try {
      return client
        .prepare(sql)
        .run(params);
    } catch ({ code }) {
      return { error: code, status: 400 };
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
      return err.code;
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
      return results;
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
  const getAll = (sql, params) => {
    try {
      const query = client.prepare(sql);
      const results = query.all(params);
      return results;
    } catch (error) {
      process.stdout.write(error);
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
      return results;
    } catch (error) {
      return { error: 'an error occured during the transaction', status: 400 };
    }
  };

  return {
    getOne,
    getAll,
    write,
    execute,
    close,
    aggregate,
  };
};
module.exports = Object.freeze(dbClient);
