import express, { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { Pages, groupListModiefied, groupDetailModified } from "../types/types";
import mysql from "../modules/dbPool";
import groupQueries from "../queries/groupQueries";
import filter from "../filter/filter";
import { checkBadges, deleteBadges } from "./badgesController";

const config = mysql.config;
const connection = mysql.MySQLRepository.getInstance(config);
class groupController {
  constructor() {}

  // api
  groupGetList: RequestHandler = async (req, res, next) => {
    const params = req.validatedData;

    // default value
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

    // variable
    const currentPage = params.page;
    const limit = currentPage - 1;
    const offset = currentPage * params.pageSize;
    const totalItemCount = await this.groupCount(
      params.isPublic,
      params.keyword
    );
    const totalPages = Math.ceil(totalItemCount / offset);

    // query
    const whereCondition = groupQueries.getWhereCondition(
      params.isPublic,
      params.keyword
    );
    const sql = groupQueries.getGroupsList(whereCondition, params.sortBy);
    const data = await connection.executeQuery(sql, [limit, offset]);
    const modified = await groupListModiefied(data);
    // await checkBadges(params.groupId);

    // return
    const item: Pages = {
      currentPage: currentPage,
      totalPages: totalPages,
      totalItemCount: totalItemCount,
      data: modified,
    };

    return res.status(StatusCodes.OK).json(item);
  };

  groupPost: RequestHandler = async (req, res, next) => {
    const params = req.validatedData;

    const postSql = groupQueries.groupPost();
    const values = [
      params.name,
      params.password,
      params.imageUrl,
      params.isPublic,
      params.introduction,
    ];
    const postData = await connection.executeQuery(postSql, values);
    await checkBadges(postData.insertId);

    const getData = await this.groupRowReturn(postData.insertId);
    return res.status(StatusCodes.CREATED).json(getData);
  };

  groupPut: RequestHandler = async (req, res, next) => {
    const params = req.validatedData;
    const putSql = groupQueries.groupPut();
    const values = [
      params.name,
      params.imageUrl,
      params.isPublic,
      params.introduction,
      params.groupId,
    ];
    await connection.executeQuery(putSql, values);
    await checkBadges(params.groupId);

    const getData = await this.groupRowReturn(params.groupId);
    return res.status(StatusCodes.OK).json(getData);
  };

  groupDelete: RequestHandler = async (req, res, next) => {
    const params = req.validatedData;
    const sql = groupQueries.groupDelete();
    
    await deleteBadges(params.groupId);
    await connection.executeQuery(sql, [params.groupId]);
    return res.status(StatusCodes.OK).json({ message: "그룹 삭제 성공" });
  };

  groupGetDetail: RequestHandler = async (req, res, next) => {
    const params = req.validatedData;
    await checkBadges(params.groupId);
    const data = await this.groupRowReturn(params.groupId);
    return res.status(StatusCodes.OK).json(data);
  };

  groupVerifyPassword: RequestHandler = async (req, res, next) => {
    return res
      .status(StatusCodes.OK)
      .json({ message: "비밀번호가 확인되었습니다" });
  };

  groupLike: RequestHandler = async (req, res, next) => {
    const { groupId } = req.params;
    const sql = groupQueries.groupLike();
    const data = await connection.executeQuery(sql, [groupId]);

    if (data.affectedRows == 1) {
      await checkBadges(Number(groupId));
      return res.status(StatusCodes.OK).json({ message: "그룹 공감하기 성공" });
    } else {
      next();
    }
  };

  groupIsPublic: RequestHandler = async (req, res, next) => {
    const { groupId } = req.params;
    const sql = groupQueries.groupIsPublic();

    const data = await connection.executeQuery(sql, [groupId]);
    const [modifiedResults] = data.map((row: any) => ({
      id: row.id,
      isPublic: Boolean(row.isPublic),
    }));
    return res.status(StatusCodes.OK).json(modifiedResults);
  };

  // Functions used
  private groupRowReturn = async (id: any): Promise<any> => {
    const sql = groupQueries.getGroupDetail();
    const result = await connection.executeQuery(sql, [id]);
    const [modified] = await groupDetailModified(result);
    return modified;
  };

  private groupCount = async (
    isPublic: boolean,
    keyword?: string
  ): Promise<any> => {
    const countSql = groupQueries.getCount(isPublic, keyword);
    const count = await connection.executeQuery(countSql, [isPublic]);
    const totalItemCount = count[0]?.totalItemCount || 0;
    return totalItemCount;
  };
}

module.exports = groupController;
