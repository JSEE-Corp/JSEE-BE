import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import mysql from "../modules/dbPool";
import { Pages, commentListModiefied } from "../types/types";
import commentQueries from "../queries/commentQueries";
import filter from "../filter/filter";

const config = mysql.config;
const connection = mysql.MySQLRepository.getInstance(config);

class commentController {
  constructor() {}

  // api
  commentGetList: RequestHandler = async (req, res, next) => {
    const params = req.validatedData;
    [params.page, params.pageSize] = filter.defaultValue(
      params.page,
      params.pageSize
    );

    const currentPage = params.page;
    const limit = currentPage - 1;
    const offset = currentPage * params.pageSize;
    const totalItemCount = await this.commentCount(params.postId);
    const totalPages = Math.ceil(totalItemCount / offset);

    const sql = commentQueries.commentsGetList();
    const data = await connection.executeQuery(sql, [
      params.postId,
      limit,
      offset,
    ]);
    const modified = await commentListModiefied(data);

    const item: Pages = {
      currentPage: currentPage,
      totalPages: totalPages,
      totalItemCount: totalItemCount,
      data: modified,
    };
    return res.status(StatusCodes.OK).json(item);
  };

  commentPost: RequestHandler = async (req, res, next) => {
    const params = req.validatedData;

    const sql = commentQueries.commentPost();
    const values = [
      params.postId,
      params.nickname,
      params.content,
      params.password,
    ];
    const postData = await connection.executeQuery(sql, values);

    const getData = await this.commentRowReturn(postData.insertId);
    return res.status(StatusCodes.CREATED).json(getData);
  };

  commentPut: RequestHandler = async (req, res, next) => {
    const params = req.validatedData;
    const values = [params.nickname, params.content, params.commentId];

    const sql = commentQueries.commentPut();
    await connection.executeQuery(sql, values);

    const getData = await this.commentRowReturn(params.commentId);
    return res.status(StatusCodes.OK).json(getData);
  };

  commentDelete: RequestHandler = async (req, res, next) => {
    const params = req.validatedData;
    const sql = commentQueries.commentDelete();

    await connection.executeQuery(sql, [params.commentId]);
    return res.status(StatusCodes.OK).json({ message: "댓글 삭제 성공" });
  };

  // Functions used
  public commentRowReturn = async (data: any): Promise<any> => {
    const sql = commentQueries.commentGetDetial();
    const result = await connection.executeQuery(sql, [data]);
    const modified = await commentListModiefied(result);
    return modified;
  };

  public commentCount = async (postId: string): Promise<any> => {
    const countSql = commentQueries.commentGetCount();
    const count = await connection.executeQuery(countSql, [postId]);
    const totalItemCount = count[0]?.totalItemCount || 0;
    return totalItemCount;
  };
}

module.exports = commentController;
