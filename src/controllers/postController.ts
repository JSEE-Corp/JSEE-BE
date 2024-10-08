import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import filter from "../filter/filter";
import mysql from "../modules/dbPool";
import postQueries from "../queries/postQueries";
import { Pages, postDetailModified, postListModified } from "../types/types";
import { checkBadges } from "./badgesController";

const config = mysql.config;
const connection = mysql.MySQLRepository.getInstance(config);

class postController {
  constructor() {}

  // api
  postGetList: RequestHandler = async (req, res, next) => {
    const params = req.validatedData;
    if (params.sortBy === "mostBadge" || params.sortBy === "mostPosted") {
      params.sortBy = "latest";
    }
    [
      params.page,
      params.pageSize,
      params.isPublic,
      params.keyword,
      params.sortBy,
    ] = filter.defaultValue(
      params.page,
      params.pageSize,
      params.isPublic,
      params.keyword,
      params.sortBy
    );
    const currentPage = params.page;
    const limit = currentPage - 1;
    const offset = currentPage * params.pageSize;
    const totalItemCount = await this.postCount(
      params.groupId,
      params.isPublic,
      params.keyword
    );
    const totalPages = Math.ceil(totalItemCount / offset);

    const whereCondition = postQueries.getWhereCondition(
      params.groupId,
      params.isPublic,
      params.keyword
    );

    const sql = postQueries.getPostsList(whereCondition, params.sortBy);
    const data = await connection.executeQuery(sql, [limit, offset]);
    await checkBadges(params.groupId);
    const modified = await postListModified(data);

    const item: Pages = {
      currentPage: currentPage,
      totalPages: totalPages,
      totalItemCount: totalItemCount,
      data: modified,
    };
    return res.status(StatusCodes.OK).json(item);
  };

  postPost: RequestHandler = async (req, res, next) => {
    const params = req.validatedData;

    const values = [
      params.groupId,
      params.nickname,
      params.title,
      params.content,
      params.imageUrl,
      params.location,
      params.moment,
      params.isPublic,
      params.postPassword,
      params.tags,
    ];
    const postSql = postQueries.postPost();
    const postData = await connection.executeQuery(postSql, values);
    await checkBadges(params.groupId);

    const getData = await this.postRowReturn(postData.insertId);
    return res.status(StatusCodes.CREATED).json(getData);
  };

  postPut: RequestHandler = async (req, res, next) => {
    const params = req.validatedData;
    const values = [
      params.nickname,
      params.title,
      params.content,
      params.imageUrl,
      params.location,
      params.moment,
      params.isPublic,
      params.tags,
      params.postId,
    ];

    const putSql = postQueries.postPut();
    await connection.executeQuery(putSql, values);

    const getIdSql = postQueries.postGetId();
    const groupId = await connection.executeQuery(getIdSql, [params.postId]);
    await checkBadges(Number(groupId[0].grpid));

    const getData = await this.postRowReturn(params.postId);
    return res.status(StatusCodes.OK).json(getData);
  };

  postDelete: RequestHandler = async (req, res, next) => {
    const params = req.validatedData;
    const sql = postQueries.postDelete();

    await connection.executeQuery(sql, [params.postId]);
    return res.status(StatusCodes.OK).json({ message: "게시글 삭제 성공" });
  };

  postGetDetail: RequestHandler = async (req, res, next) => {
    const params = req.validatedData;
    const data = await this.postRowReturn(params.postId);
    return res.status(StatusCodes.OK).json(data);
  };

  postVerifyPassword: RequestHandler = async (req, res, next) => {
    const params = req.validatedData;
    const inputPassword = params.password || params.postPassword;
    const sql = postQueries.postVerifyPassword();
    const data = await connection.executeQuery(sql, [params.postId]);
    const password = data[0]?.password || "";

    if (inputPassword !== password) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "비밀번호가 틀렸습니다" });
    } else {
      return res
        .status(StatusCodes.OK)
        .json({ message: "비밀번호가 확인되었습니다" });
    }
  };

  postLike: RequestHandler = async (req, res, next) => {
    const { postId } = req.params;
    const sql = postQueries.postLike();
    const data = await connection.executeQuery(sql, [postId]);

    if (data.affectedRows == 1) {
      const getIdSql = postQueries.postGetId();
      const groupId = await connection.executeQuery(getIdSql, [postId]);
      await checkBadges(Number(groupId[0].grpid));
      return res
        .status(StatusCodes.OK)
        .json({ message: "게시글 공감하기 성공" });
    } else {
      next();
    }
  };

  postIsPublic: RequestHandler = async (req, res, next) => {
    const { postId } = req.params;
    const sql = postQueries.postIsPublic();

    const data = await connection.executeQuery(sql, [postId]);
    const [modifiedResults] = data.map((row: any) => ({
      id: row.id,
      isPublic: Boolean(row.isPublic),
    }));
    return res.status(StatusCodes.OK).json(modifiedResults);
  };

  // Functions used
  private postRowReturn = async (id: any): Promise<any> => {
    const sql = postQueries.getPostDetail();
    const result = await connection.executeQuery(sql, [id]);
    const modified = await postDetailModified(result);
    return modified;
  };

  private postCount = async (
    groupId: string,
    isPublic: boolean,
    keyword?: string
  ): Promise<any> => {
    const countSql = postQueries.getCount(groupId, isPublic, keyword);
    const count = await connection.executeQuery(countSql, [isPublic]);
    const totalItemCount = count[0]?.totalItemCount || 0;
    return totalItemCount;
  };
}

module.exports = postController;
