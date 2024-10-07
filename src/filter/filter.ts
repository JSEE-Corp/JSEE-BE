// express-validator 사용하여 유효성 검사 추가
import { RequestHandler } from "express";
import StatusCodes from "http-status-codes";
import mysql from "../modules/dbPool";
import groupQueries from "../queries/groupQueries";
import postQueries from "../queries/postQueries";
import commentQueries from "../queries/commentQueries";
import groupDto from "../filter/groupValidator";
import postDto from "../filter/postValidator";
import commentDto from "../filter/commentValidator";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

const config = mysql.config;
const connection = mysql.MySQLRepository.getInstance(config);

// group
const groupVerify: RequestHandler = async (req, res, next) => {
  const method = req.method;
  let combinedParams;
  let dtoObject;

  switch (method) {
    case "GET":
      combinedParams = { ...req.query, ...req.params };
      dtoObject = plainToClass(groupDto.groupParamsDto, combinedParams);
      break;
    case "POST":
      combinedParams = { ...req.params, ...req.body };
      dtoObject = plainToClass(groupDto.groupInputDto, combinedParams);
      break;
    case "PUT":
    default:
      combinedParams = { ...req.params, ...req.body };
      dtoObject = plainToClass(groupDto.groupInputDto, combinedParams);
      break;
  }

  const errors = await validate(dtoObject);
  if (errors.length > 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "잘못된 요청입니다" });
  }
  req.validatedData = dtoObject;
  next();
};

const groupPasswordVerify: RequestHandler = async (req, res, next) => {
  const combinedParams = { ...req.params, ...req.body };
  const dtoObject = plainToClass(groupDto.groupPasswordDto, combinedParams);
  const errors = await validate(dtoObject);
  if (errors.length > 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "잘못된 요청입니다" });
  }
  req.validatedData = dtoObject;

  const inputPassword = dtoObject.password;
  const sql = groupQueries.groupVerifyPassword();
  const data = await connection.executeQuery(sql, [dtoObject.groupId]);
  const password = data[0]?.password || "";

  if (inputPassword !== password) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "비밀번호가 틀렸습니다" });
  }
  next();
};

// post
const postVerify: RequestHandler = async (req, res, next) => {
  const method = req.method;
  let combinedParams;
  let dtoObject;

  switch (method) {
    case "GET":
      combinedParams = { ...req.query, ...req.params };
      dtoObject = plainToClass(postDto.postParamsDto, combinedParams);
      break;
    case "POST":
      combinedParams = { ...req.params, ...req.body };
      dtoObject = plainToClass(postDto.postPostDto, combinedParams);
      break;
    case "PUT":
    default:
      combinedParams = { ...req.params, ...req.body };
      dtoObject = plainToClass(postDto.postPutDto, combinedParams);
      break;
  }

  const errors = await validate(dtoObject);
  if (errors.length > 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "잘못된 요청입니다" });
  }
  req.validatedData = dtoObject;
  next();
};

const postIdVerify: RequestHandler = async (req, res, next) => {
  const combinedParams = { ...req.params };
  const dtoObject = plainToClass(postDto.postNumDto, combinedParams);
  const errors = await validate(dtoObject);
  if (errors.length > 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "잘못된 요청입니다" });
  }
  req.validatedData = dtoObject;
  next();
};

const postPasswordVerify: RequestHandler = async (req, res, next) => {
  const combinedParams = { ...req.params, ...req.body };
  const dtoObject = plainToClass(postDto.postPasswordDto, combinedParams);
  const errors = await validate(dtoObject);
  if (errors.length > 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "잘못된 요청입니다" });
  }
  req.validatedData = dtoObject;

  const inputPassword = dtoObject.password || dtoObject.postPassword;
  const sql = postQueries.postVerifyPassword();
  const data = await connection.executeQuery(sql, [dtoObject.postId]);
  const password = data[0]?.password || "";

  if (inputPassword !== password) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "비밀번호가 틀렸습니다" });
  }
  next();
};

// comment
const commentVerify: RequestHandler = async (req, res, next) => {
  const method = req.method;
  let combinedParams;
  let dtoObject;

  switch (method) {
    case "GET":
      combinedParams = { ...req.query, ...req.params };
      dtoObject = plainToClass(commentDto.commentParamsDto, combinedParams);
      break;
    case "POST":
      combinedParams = { ...req.params, ...req.body };
      dtoObject = plainToClass(commentDto.commentPostDto, combinedParams);
      break;
    case "PUT":
    default:
      combinedParams = { ...req.params, ...req.body };
      dtoObject = plainToClass(commentDto.commentPutDto, combinedParams);
      break;
  }

  const errors = await validate(dtoObject);
  if (errors.length > 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "잘못된 요청입니다" });
  }
  req.validatedData = dtoObject;
  next();
};

const commentPasswordVerify: RequestHandler = async (req, res, next) => {
  const combinedParams = { ...req.params, ...req.body };
  const dtoObject = plainToClass(commentDto.commentPasswordDto, combinedParams);
  const errors = await validate(dtoObject);
  if (errors.length > 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "잘못된 요청입니다" });
  }
  req.validatedData = dtoObject;

  const inputPassword = dtoObject.password;
  const sql = commentQueries.commentVerifyPassword();
  const data = await connection.executeQuery(sql, [dtoObject.commentId]);
  const password = data[0]?.password || "";

  if (inputPassword !== password) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "비밀번호가 틀렸습니다" });
  }
  next();
};

const notFound: RequestHandler = (req, res) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({ message: "존재하지 않습니다" });
};


// Default values
const defaultValue = (
  page: string,
  pageSize: string,
  isPublic?: string | undefined,
  keyword?: string | undefined,
  sortBy?: string,
  badges?: [string]
) => {
  const newPage = isNaN(parseInt(page)) ? 1 : parseInt(page);
  const newPageSize = isNaN(parseInt(pageSize)) ? 10 : parseInt(pageSize);
  const newIsPublic = isPublic === undefined ? true : isPublic;
  const newKeyword = keyword || "";
  const newBadges = badges || [];

  const newSort = (() => {
    switch (sortBy) {
      case "mostPosted":
        return "postCount DESC";
      case "mostBadge":
        return "b.badgeSum DESC";
      case "mostLiked":
        return "likeCount DESC";
      case "latest":
      default:
        return "createdAt DESC";
    }
  })();

  return [newPage, newPageSize, newIsPublic, newKeyword, newSort, newBadges];
};

export default {
  groupVerify,
  groupPasswordVerify,
  postVerify,
  postIdVerify,
  postPasswordVerify,
  commentVerify,
  commentPasswordVerify,
  notFound,
  defaultValue,
};
