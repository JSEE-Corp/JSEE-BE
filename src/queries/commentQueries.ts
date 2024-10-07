const commentQueries = {
  commentsGetList: () => {
    return `SELECT * FROM Comments
            WHERE postId=?
            LIMIT ?, ?`;
  },
  commentPost: () => {
    return `INSERT INTO Comments
                  (postId, nickname, content, password)
                  VALUES (?, ?, ?, ?)`;
  },
  commentPut: () => {
    return `UPDATE Comments SET
                nickname=?, content=?
                WHERE id=?`;
  },
  commentDelete: () => {
    return `DELETE FROM Comments WHERE id=?`;
  },
  commentGetCount: () => {
    return `SELECT Count(*) AS totalItemCount FROM Comments WHERE postId=?`;
  },
  commentGetDetial: () => {
    return `SELECT * FROM Comments WHERE id=?`;
  },
  commentVerifyPassword: () => {
    return `SELECT password FROM Comments WHERE id=?`;
  },
};


export default commentQueries;