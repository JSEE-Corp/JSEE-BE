const badgeQueries = {
  check7DaysPost: () => {
    return `SELECT COUNT(DISTINCT DATE(createdAt)) AS dayCount
            FROM Posts
            WHERE
              grpId = ?
              AND createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;
  },
  checkPost20Plus: () => {
    return `SELECT COUNT(*) AS postCount FROM Posts WHERE grpId = ?`;
  },
  check1YearGroup: () => {
    return `SELECT createdAt FROM GroupInfo WHERE id = ?`;
  },
  checkGrpLike10k: () => {
    return `SELECT likeCount FROM GroupInfo WHERE id=?`
  },
  checkPostLike10k: () => {
    return `SELECT COUNT(*) AS postCount
            FROM Posts
            WHERE grpId = ? AND likeCount >= 10000`;
  },
  badgesInsert: () => {
    return `INSERT INTO Badges
            (grpId, post7Days, post20Plus, grp1Year, grpLike10k, postLike10k)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            post7Days = IF(post7Days = false, VALUES(post7Days), post7Days),
            post20Plus = IF(post20Plus = false, VALUES(post20Plus), post20Plus),
            grp1Year = IF(grp1Year = false, VALUES(grp1Year), grp1Year),
            grpLike10k = IF(grpLike10k = false, VALUES(grpLike10k), grpLike10k),
            postLike10k = IF(postLike10k = false, VALUES(postLike10k), postLike10k);`;
  },
  badgesDelete: () => {
    return `DELETE FROM Badges WHERE grpId=?`;
  }
};

export default badgeQueries;
