import {
  IsOptional,
  IsString,
  IsNumber,
  Length,
  MaxLength,
  IsBoolean,
} from "class-validator";
import { Transform } from "class-transformer";

// 그룹 등록 및 수정
class groupInputDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  groupId?: number;

  @IsString()
  @Length(2, 20, {
    message: "이름은 2~20자 이하로 입력해주세요.",
  })
  name!: string;

  @IsString()
  @Length(4, 20, {
    message: "비밀번호는 4~20자 이하로 입력해주세요.",
  })
  password!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Transform(
    ({ value }) => value === undefined || value === "true" || value === true
  )
  @IsBoolean()
  isPublic!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200, {
    message: "200자 이하로 입력해주세요.",
  })
  introduction?: string;
}

// 그룹 목록 전체 조회
class groupParamsDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  groupId?: number;

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

// 그룹 비밀번호
class groupPasswordDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  groupId!: number;

  @IsString()
  @Length(4, 20, {
    message: "비밀번호는 4~20자 이하로 입력해주세요.",
  })
  password?: string;
}

export default { groupInputDto, groupParamsDto, groupPasswordDto };
