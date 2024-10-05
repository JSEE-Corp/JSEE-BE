import {
  IsString,
  IsNumber,
  IsOptional,
  Length,
} from "class-validator";
import { Transform } from "class-transformer";

// 댓글 등록
class commentPostDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  postId!: number;

  @IsString()
  @Length(2, 20, {
    message: "이름은 2~20자 사이로 입력해주세요.",
  })
  nickname!: string;

  @IsString()
  @Length(1, 30000, {
    message: "1~30000자 사이로 입력해주세요.",
  })
  content!: string;

  @IsString()
  @Length(4, 20, {
    message: "비밀번호는 4~20자 사이로 입력해주세요.",
  })
  password!: string;
}

// 댓글 목록 전체 조회
class commentParamsDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  postId!: number;

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
}

// 댓글 수정
class commentPutDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  commentId!: number;

  @IsString()
  @Length(2, 20, {
    message: "이름은 2~20자 사이로 입력해주세요.",
  })
  nickname!: string;

  @IsString()
  @Length(1, 30000, {
    message: "1~30000자 사이로 입력해주세요.",
  })
  content!: string;

  @IsString()
  @Length(4, 20, {
    message: "비밀번호는 4~20자 사이로 입력해주세요.",
  })
  password!: string;
}

// 댓글 비밀번호
class commentPasswordDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  commentId!: number;

  @IsString()
  @Length(4, 20, {
    message: "비밀번호는 4~20자 이하로 입력해주세요.",
  })
  password!: string;
}

export default {
  commentPostDto,
  commentParamsDto,
  commentPutDto,
  commentPasswordDto,
};
