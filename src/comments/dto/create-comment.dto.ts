import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsUrl, MinLength } from "class-validator";

export class CreateCommentDto {

	@ApiProperty({ example: 'This is true!' })
  @IsNotEmpty()
  @MinLength(4)
	value: string

	@ApiProperty({ type: 'string', required: false })
	@IsUrl()
  @IsOptional()
	homePage?: string;

	@ApiProperty({ type: 'string', required: false })
	@IsNumberString()
  @IsOptional()
	parentId?: number;

	@ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
	file: Express.Multer.File;

	@ApiProperty({ type: 'string', required: true })
  @IsNotEmpty()
	recaptcha: any
}
