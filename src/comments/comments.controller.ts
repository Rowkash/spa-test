import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  Req,
  UploadedFile,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { FileValidationPipe } from 'src/pipes/file.validation.pipe';
import { GetAllParams } from './dto/getAll-params';
import { EventsGateway } from 'src/events/events.gateway';
import { AuthGuard } from 'src/guards/auth.guard';
import { CommentEntity } from './entities/comment.entity';

interface IRequest extends Request {
  user: {
    id: number;
    role: string;
  };
}

@ApiTags("Comments")
@Controller('comments')
export class CommentsController {
	constructor(
		private readonly commentsService: CommentsService,
		private readonly eventsGateway: EventsGateway,
	) { }

	// =============== Create comment =============== //

	@ApiOperation({ summary: 'Create Comment' })
	@ApiConsumes('multipart/form-data')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('file'))
	@Post()
	async create(
		@Body() dto: CreateCommentDto,
		@Req() req: IRequest,
		@UploadedFile(new FileValidationPipe()) file?: Express.Multer.File,
	) {
		const authorId = req.user.id;
		if (file) dto.file = file;
		const comment = await this.commentsService.create(dto, authorId);
		this.eventsGateway.sendComment(comment);
		return comment;
	}

	// =============== Get many comments =============== //

	@ApiOperation({ summary: 'Get many comments', description: "sortBy (createdAt, userName), orderBy (ASC, DESC), limit, page" })
	@Get()
	@ApiOkResponse({ type: [CommentEntity] })
  findAll(
    @Query(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    query: GetAllParams,
  ) {
    return this.commentsService.findAll(query);
  }

	// =============== Get one comment =============== //

	@Get(':id')
	@ApiOkResponse({ type: CommentEntity })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }
}
