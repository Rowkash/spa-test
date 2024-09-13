import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { GetAllParams } from './dto/getAll-params';
import { checkRecaptcha } from 'src/utils/check-recaptcha';
import { checkHtmlTags } from 'src/utils/check-html-tags';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    private fileService: FilesService,
  ) {}

	// =============== Create comment =============== //

	async create(dto: CreateCommentDto, authorId: number) {
    const user = { id: authorId };
    await checkRecaptcha(dto.recaptcha);
		checkHtmlTags(dto.value);
		if (dto.parentId) {
		}
    const comment = new CommentEntity();
		comment.value = dto.value;
    if (dto.homePage) comment.homePage = dto.homePage;
    if (dto.file) {
      comment.file = await this.fileService.saveFile(dto.file);
		}
		if (dto.parentId) {
			const findComment =  await this.commentRepository.findOneBy({id: +dto.parentId})
			if(findComment) comment.parent = findComment
		}
    return await this.commentRepository.save({ ...comment, user });
  }

	// =============== Get many comments =============== //

  async findAll(query: GetAllParams) {
    const limit = query.limit || 25;
    const page = query.page || 1;
    const sortBy = query.sortBy || 'createdAt';
    const order = query.order || 'ASC';

    const builder = this.commentRepository
      .createQueryBuilder('comment')
			.leftJoin('comment.user', 'user')
			.leftJoinAndSelect("comment.children", "children")
			.leftJoin('children.user', 'childUser')
			.addSelect(['user.id', 'user.userName'])
			.addSelect(['childUser.id', 'childUser.userName'])

    builder.orderBy(`comment.${sortBy}`, order);
    if (sortBy === 'userName') {
      builder.orderBy(`user.${sortBy}`, order);
    }
    builder.skip((page - 1) * limit).take(limit);
    const [data, total] = await builder.getManyAndCount();

    return { data, page, totalPages: Math.ceil(total / limit) };
  }

	// =============== Get one comment =============== //

  async findOne(id: CommentEntity['id']) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'children'],
		});
		if(!comment) throw new NotFoundException("Comment not found")
    const user = { id: comment.user.id, name: comment.user.userName };

    return { ...comment, user };
  }
}
