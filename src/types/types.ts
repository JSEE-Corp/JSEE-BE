interface Pages {
  currentPage: number;
  totalPages: number;
  totalItemCount: number;
  data: [];
}

const groupListModiefied = async (data: any): Promise<any> => {
  const modifiedResults = data.map((row: any) => ({
    id: row.id,
    name: row.name,
    imageUrl: row.imageUrl,
    isPublic: Boolean(row.isPublic),
    likeCount: row.likeCount,
    badgeCount: row.badgeSum,
    postCount: row.postController,
    createdAt: row.createdAt,
    introduction: row.introduction,
  }));
  return modifiedResults;
};

const groupDetailModified = async (data: any): Promise<any> => {
  const modifiedResults = data.map((row: any) => {
    const badges = [
      row.post7Days,
      row.post20Plus,
      row.grp1Year,
      row.grpLike10k,
      row.postLike10k,
    ].filter(Boolean);

    return {
      id: row.id,
      name: row.name,
      imageUrl: row.imageUrl,
      isPublic: Boolean(row.isPublic),
      likeCount: row.likeCount,
      badges: badges,
      postCount: row.postController,
      createdAt: row.createdAt,
      introduction: row.introduction,
    };
  });
  return modifiedResults;
};

const postListModified = async (data: any): Promise<any> => {
  const modifiedResults = data.map((row: any) => {
    row.moment.setHours(row.moment.getHours() + 9);
    const dateObj = row.moment.toISOString().split("T")[0];

    return {
      id: row.id,
      nickname: row.nickname,
      title: row.title,
      imageUrl: row.imageUrl,
      tags: JSON.parse(row.tags),
      location: row.location,
      moment: dateObj,
      isPublic: Boolean(row.isPublic),
      likeCount: row.likeCount,
      commentCount: row.commentCount,
      createdAt: row.createdAt,
    };
  });
  return modifiedResults;
};

const postDetailModified = async (data: any): Promise<any> => {
  const modifiedResults = data.map((row: any) => {
    row.moment.setHours(row.moment.getHours() + 9);
    const dateObj = row.moment.toISOString().split("T")[0];

    return {
      id: row.id,
      nickname: row.nickname,
      title: row.title,
      imageUrl: row.imageUrl,
      tags: JSON.parse(row.tags),
      location: row.location,
      moment: dateObj,
      isPublic: Boolean(row.isPublic),
      likeCount: row.likeCount,
      commentCount: row.commentCount,
      createdAt: row.createdAt,
    };
  });
  return modifiedResults;
};

const commentListModiefied = async (data: any): Promise<any> => {
  const modifiedResults = data.map((row: any) => ({
    id: row.id,
    nickname: row.nickname,
    content: row.content,
    createdAt: row.createdAt,
  }));
  return modifiedResults;
};

export {
  Pages,
  groupListModiefied,
  groupDetailModified,
  postListModified,
  postDetailModified,
  commentListModiefied,
};
