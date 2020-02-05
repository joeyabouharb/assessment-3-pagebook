const DatabaseClient = require('./DatabaseClient');

const PostRepository = () => {
  const client = DatabaseClient();

  const createPost = (post) => {
    const sql = `
    INSERT INTO Posts(pageID, postContent, postID, postCreated, isPublished)
    VALUES($pageID, $postContent, $postID, $postCreated, $isPublished)
    `;
    const result = client.modify(sql, post);
    if (result.error) {
      return { result: 'could not create resource at this time', status: 400 };
    }
    return result;
  };

  const createMany = (pages) => {
    const sql = `
    INSERT INTO Posts(pageID, postContent, postID, postCreated, isPublished)
    VALUES($pageID, $postContent, $postID, $postCreated, $isPublished)
    `;
    const result = client.batchModify(sql, pages);
    return result;
  };

  const modifyPost = (post, postID) => {
    const sql = `
    UPDATE Posts
    SET
    postContent = $postContent,
    isPublished = $isPublished
    WHERE postID == $postID
    `;
    const result = client.modify(sql, { ...post, postID });
    if (result.error) {
      return { error: 'resource could not be updated', status: 400 };
    }
    return result;
  };

  const deletePost = (postID) => {
    const sql = `
      DELETE FROM Posts
      WHERE postID == $postID
    `;
    const result = client.modify(sql, { postID });
    if (result.error) {
      return { error: 'resource could not be deleted', status: 404 };
    }
    return result;
  };

  const publishPost = (postID) => {
    const sql = `
    UPDATE Posts
    SET
    isPublished = 1
    WHERE postID = $postID
    `;
    const result = client.modify(sql, { postID });
    if (result.error) {
      return { error: 'error publishing content', status: 400 };
    }
    return result;
  };


  const getPublished = (pageID) => {
    const sql = `
    SELECT po.postContent, po.postCreated
    FROM Posts po
    INNER JOIN Pages pa
    ON pa.pageID == $pageID
    WHERE po.isPublished == '0'
    ORDER BY po.postCreated
    `;
    const result = client.getAll(sql, { pageID });
    if (result.error) {
      return { error: 'could not access resource at this time', status: 400 };
    }
    return result;
  };

  const getPostOnStatus = (pageID, accountID, isPublished) => {
    const sql = `
    SELECT postContent, postCreated, pageName
    FROM Posts po
    INNER JOIN Pages pa
    ON pa.pageID ==  po.pageID
    INNER JOIN Accounts a
    ON a.accountID == pa.accountID
    WHERE isPublished == $isPublished
    AND pa.pageID == $pageID
    ORDER BY postCreated
    `;
    const result = client.getAll(sql, { pageID, accountID, isPublished });
    if (result.error) {
      // eslint-disable-next-line no-console
      console.log(result.error);
      return { error: 'could not access resource at this time - forbidden?', code: 403 };
    }
    return result;
  };

  const getPostByLikes = (pageID) => {
    const sql = `
    SELECT p.postContent, p.datePublished, COUNT(pol.accountID) as likes
    FROM posts po
    INNER JOIN Pages pa
      ON pa.pageID == po.pageID
    INNER JOIN postLikes pol
      ON pol.pageID == po.pageID
    WHERE po.pageID == $pageID
    GROUP BY po.postID
    ORDER BY likes
    `;
    const result = client.getAll(sql, { pageID });
    if (result.error) {
      return { ...result, status: 400 };
    }
    return result;
  };

  const sortPostsByImpressions = (pageID) => {
    const sql = `
    SELECT poa.result, poa.confidence, po.postContent
    FROM post po
    INNER JOIN Pages pa
    ON pa.pageID == po.pageID
    INNER JOIN postAnalysis poa
    ON poa.postID == po.postID
    WHERE po.postID == $pageID
    `;
    const result = client.getAll(sql, { pageID });
    if (result.error) {
      return { ...result, status: 400 };
    }
    return result;
  };

  const getMaxEstimatedLiked = (pageID) => {
    const sql = `
    SELECT pa.pageName, MAX(estimatedLikes), po.postID, postContent
    FROM PostAnalysis poa
    INNER JOIN Posts po
    ON po.postID == poa.postID
    INNER JOIN Pages pa
    ON pa.pageID == po.pageID
    WHERE pa.pageID == $pageID
    GROUP BY pa.pageID
    `;

    const result = client.getOne(sql, { pageID });
    return result;
  };

  const createBatchPostAnalysis = (analyses) => {
    const sql = `
    INSERT INTO PostAnalysis(postID, results, confidence, estimatedLikes)
    VALUES($postID, $results, $confidence, $estimatedLikes)
    `;
    return client.batchModify(sql, analyses);
  };
  return Object.freeze({
    createPost,
    modifyPost,
    deletePost,
    publishPost,
    getPublished,
    getPostOnStatus,
    getPostByLikes,
    sortPostsByImpressions,
    createMany,
    createBatchPostAnalysis,
    close: () => { client.close(); },
    getMaxEstimatedLiked,
  });
};

module.exports = Object.freeze(PostRepository);
