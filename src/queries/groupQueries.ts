const groupQueries = {
  getGroupsList: (whereCondition: string, sortKey: string) => {
    return `SELECT 
                g.id,
                g.name,
                g.imageUrl,
                g.isPublic,
                g.likeCount,
                g.badgeCount,
                g.postCount,
                g.createdAt,
                g.introduction,
                g.password,
                CASE WHEN b.post7Days THEN 'post7Days' END AS post7Days,
                CASE WHEN b.post20Plus THEN 'post20Plus' END AS post20Plus,
                CASE WHEN b.grp1Year THEN 'grp1Year' END AS grp1Year,
                CASE WHEN b.grpLike10k THEN 'grpLike10k' END AS grpLike10k,
                CASE WHEN b.postLike10k THEN 'postLike10k' END AS postLike10k
            FROM 
                GroupInfo g
            LEFT JOIN 
                Badges b ON g.id = b.grpId
            WHERE ${whereCondition}
            ORDER BY ${sortKey}
            LIMIT ?, ?`;
  },
  getGroupDetail: () => {
    return `SELECT 
                g.id,
                g.name,
                g.imageUrl,
                g.isPublic,
                g.likeCount,
                g.badgeCount,
                g.postCount,
                g.createdAt,
                g.introduction,
                g.password,
                CASE WHEN b.post7Days THEN 'post7Days' END AS post7Days,
                CASE WHEN b.post20Plus THEN 'post20Plus' END AS post20Plus,
                CASE WHEN b.grp1Year THEN 'grp1Year' END AS grp1Year,
                CASE WHEN b.grpLike10k THEN 'grpLike10k' END AS grpLike10k,
                CASE WHEN b.postLike10k THEN 'postLike10k' END AS postLike10k
            FROM 
                GroupInfo g
            LEFT JOIN 
                Badges b ON g.id = b.grpId
            WHERE g.id=?`;
  },
  getCount: (isPublic: boolean, keyword?: string) => {
    const whereCondition = groupQueries.getWhereCondition(isPublic, keyword);
    return `SELECT Count(*) AS totalItemCount FROM GroupInfo WHERE ${whereCondition}`;
  },
  getWhereCondition: (isPublic: boolean, keyword?: string) => {
    let whereCondition = `isPublic=${isPublic}`;
    if (keyword != "") {
      whereCondition += ` AND name LIKE '%${keyword}%'`;
    }
    return whereCondition;
  },

  groupPost: () => {
    return `INSERT INTO GroupInfo
                  (name, password, imageUrl, isPublic, introduction)
                  VALUES (?, ?, ?, ?, ?)`;
  },
  groupPut: () => {
    return `UPDATE GroupInfo SET
                  name=?,
                  imageUrl=?,
                  isPublic=?,
                  introduction=?
                  WHERE id=?`;
  },
  groupDelete: () => {
    return `DELETE FROM GroupInfo WHERE id=?`;
  },
  groupVerifyPassword: () => {
    return `SELECT password FROM GroupInfo WHERE id=?`;
  },
  groupLike: () => {
    return `UPDATE Groupinfo set likeCount=likeCount+1 WHERE id=?`;
  },
  groupLikeRollback: () => {
    return `UPDATE Groupinfo set likeCount=likeCount-1 WHERE id=?`;
  },
  groupIsPublic: () => {
    return `SELECT id, isPublic FROM GroupInfo WHERE id=?`;
  },
};

export default groupQueries;
