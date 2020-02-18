/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/**
 * Creates a connection to a database to handle read/write access.
 *
 */
const SqliteDB = Object.freeze(require('better-sqlite3'));

/**
 * factory function:
 *
 * produces a connection to an SQL database with basic CRUD operations
 * @param {string} connection
 */
const dbClient = (connectionString) => {
  const client = new SqliteDB(connectionString);

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
      return { error, status: 400 };
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
  const getAll = (sql, params) => {
    try {
      const query = client.prepare(sql);
      const results = query.all(params);
      return results.length > 0 ? results : { error: 'not found', status: 404 };
    } catch (error) {
      console.log(error);
      return { error: 'something bad happenned during the transaction', status: 400 };
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

  const backup = async () => {
    const result = await client.backup('./sql/data.sql')
      .catch((err) => err);
    return result;
  };
  const batchModify = (sql, data) => new Promise((resolve, reject) => {
    try {
      const query = client.prepare(sql);
      const execAll = client.transaction((items) => {
        for (const item of items) query.run(item);
      });
      const result = execAll(data);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });

  return Object.freeze({
    getOne,
    getAll,
    modify,
    execute,
    close,
    aggregate,
    backup,
    batchModify,
  });
};
module.exports = Object.freeze({
  pagesDb: () => dbClient(process.env.PAGES_DB),
});
