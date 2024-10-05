import mysql from "../modules/dbPool";
import badgeQueries from "../queries/badgesQueries";

const config = mysql.config;
const connection = mysql.MySQLRepository.getInstance(config);

async function checkConsecutive7DaysPost(groupId: number): Promise<boolean> {
  const sql = badgeQueries.check7DaysPost();
  const data = await connection.executeQuery(sql, [groupId]);
  return data[0].dayCount >= 7;
}

async function checkPost20Plus(groupId: number): Promise<boolean> {
  const sql = badgeQueries.checkPost20Plus();
  const data = await connection.executeQuery(sql, [groupId]);
  return data[0].postCount >= 20;
}

async function check1YearGroup(groupId: number): Promise<boolean> {
  const sql = badgeQueries.check1YearGroup();
  const data = await connection.executeQuery(sql, [groupId]);
  const createdAt = new Date(data[0].createdAt);
  const oneYearLater = new Date(
    createdAt.setFullYear(createdAt.getFullYear() + 1)
  );
  return new Date() >= oneYearLater;
}

async function checkPostLike10k(groupId: number): Promise<boolean> {
  const postSql = badgeQueries.checkPostLike10k();
  const postData = await connection.executeQuery(postSql, [groupId]);
  return postData[0].postCount > 0;
}

async function checkGroupLike10k(groupId: number): Promise<boolean> {
  const sql = badgeQueries.checkGrpLike10k();
  const data = await connection.executeQuery(sql, [groupId]);
  return data[0].likeCount >= 10000;
}

async function checkBadges(groupId: number) {
  const badges = {
    post7Days: false,
    post20Plus: false,
    group1Year: false,
    groupLike10k: false,
    postLike10k: false,
  };

  if (await checkConsecutive7DaysPost(groupId)) {
    badges.post7Days = true;
  }
  if (await checkPost20Plus(groupId)) {
    badges.post20Plus = true;
  }
  if (await check1YearGroup(groupId)) {
    badges.group1Year = true;
  }
  if (await checkGroupLike10k(groupId)) {
    badges.groupLike10k = true;
  }
  if (await checkPostLike10k(groupId)) {
    badges.postLike10k = true;
  }

  const sql = badgeQueries.badgesInsert();
  const data = await connection.executeQuery(sql, [
    groupId,
    badges.post7Days,
    badges.post20Plus,
    badges.group1Year,
    badges.groupLike10k,
    badges.postLike10k,
  ]);
}

async function deleteBadges(groupId: number) {
  const sql = badgeQueries.badgesDelete();
  await connection.executeQuery(sql, [groupId]);
}

export { checkBadges, deleteBadges };
