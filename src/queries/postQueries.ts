const postQueries = {
  getPostsList: (whereCondition: string, sortKey: string) => {
    return `SELECT * FROM Posts
              WHERE ${whereCondition}
              ORDER BY ${sortKey}
              LIMIT ?, ?`;
  },
  getPostDetail: () => {
    return `SELECT * FROM Posts WHERE id=?`;
  },
  getCount: (groupId: string, isPublic: boolean, keyword?: string) => {
    const whereCondition = postQueries.getWhereCondition(
      groupId,
      isPublic,
      keyword
    );
    return `SELECT Count(*) AS totalItemCount FROM Posts WHERE ${whereCondition}`;
  },
  getWhereCondition: (groupId: string, isPublic: boolean, keyword?: string) => {
    let whereCondition = `grpId=${groupId} AND isPublic=${isPublic}`;
    if (keyword != "") {
      whereCondition += ` AND p.title LIKE '%${keyword}%'`;
    }
    return whereCondition;
  },

  postPost: () => {
    return `INSERT INTO Posts
                  (grpId, nickname, title, content, imageUrl, location, moment, isPublic, password, tags)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, JSON_ARRAY(?))`;
  },
  postPut: () => {
    return `UPDATE Posts SET
                  nickname=?,
                  title=?,
                  content=?,
                  imageUrl=?,
                  location=?,
                  moment=?,
                  isPublic=?,
                  tags=JSON_ARRAY(?)
                WHERE id=?`;
  },
  postDelete: () => {
    return `DELETE FROM Posts WHERE id=?`;
  },
  postVerifyPassword: () => {
    return `SELECT password FROM Posts WHERE id=?`;
  },
  postLike: () => {
    return `UPDATE Posts set likeCount=likeCount+1 WHERE id=?`;
  },
  postLikeRollback: () => {
    return `UPDATE Posts set likeCount=likeCount-1 WHERE id=?`;
  },
  postIsPublic: () => {
    return `SELECT id, isPublic FROM Posts WHERE id=?`;
  },
};

export default postQueries;
