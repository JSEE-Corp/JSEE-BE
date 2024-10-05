import {
  IsOptional,
  IsString,
  IsArray,
  IsDateString,
  IsNumber,
  IsBoolean,
  Length,
} from "class-validator";
import { Transform } from "class-transformer";

// 게시글 등록
class postPostDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  groupId!: number;

  @IsString()
  @Length(2, 20, {
    message: "이름은 2~20자 사이로 입력해주세요.",
  })
  nickname!: string;

  @IsString()
  @Length(1, 100, {
    message: "제목은 1~100자 사이로 입력해주세요.",
  })
  title!: string;

  @IsString()
  @Length(1, 30000, {
    message: "1~30000자 사이로 입력해주세요.",
  })
  content!: string;

  @IsString()
  @Length(4, 20, {
    message: "비밀번호는 4~20자 사이로 입력해주세요.",
  })
  postPassword!: string;

  @IsString()
  @Length(4, 20, {
    message: "비밀번호는 4~20자 사이로 입력해주세요.",
  })
  groupPassword!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  tags?: Array<string>;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  moment?: string;

  @Transform(
    ({ value }) => value === undefined || value === "true" || value === true
  )
  @IsBoolean()
  isPublic!: boolean;
}

// 게시글 목록 전체 조회
class postParamsDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  groupId!: number;

  @Transform(({ value }) =>
    Number.isNaN(parseInt(value)) || value === undefined ? 1 : parseInt(value)
  )
  @IsOptional()
  @IsNumber()
  page!: number;

  @Transform(({ value }) =>
    Number.isNaN(parseInt(value)) || value === undefined ? 10 : parseInt(value)
  )
  @IsOptional()
  @IsNumber()
  pageSize!: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @Transform(
    ({ value }) => value === undefined || value === "true" || value === true
  )
  @IsOptional()
  @IsBoolean()
  isPublic!: boolean;
}

// 게시글 수정
class postPutDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  postId!: number;

  @IsString()
  @Length(2, 20, {
    message: "이름은 2~20자 사이로 입력해주세요.",
  })
  nickname!: string;

  @IsString()
  @Length(1, 100, {
    message: "제목은 1~100자 사이로 입력해주세요.",
  })
  title!: string;

  @IsString()
  @Length(1, 30000, {
    message: "1~30000자 사이로 입력해주세요.",
  })
  content!: string;

  @IsString()
  @Length(4, 20, {
    message: "비밀번호는 4~20자 사이로 입력해주세요.",
  })
  postPassword!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  tags?: Array<string>;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  moment?: string;

  @Transform(
    ({ value }) => value === undefined || value === "true" || value === true
  )
  @IsBoolean()
  isPublic!: boolean;
}

// 게시글 비밀번호
class postPasswordDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  postId!: number;

  @IsOptional()
  @IsString()
  @Length(4, 20, {
    message: "비밀번호는 4~20자 이하로 입력해주세요.",
  })
  password!: string;

  @IsOptional()
  @IsString()
  @Length(4, 20, {
    message: "비밀번호는 4~20자 이하로 입력해주세요.",
  })
  postPassword!: string;
}

class postNumDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  postId!: number;
}

export default {
  postPostDto,
  postParamsDto,
  postPutDto,
  postPasswordDto,
  postNumDto,
};
