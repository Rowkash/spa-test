import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentEntity } from './entities/comment.entity';
import { FilesModule } from 'src/files/files.module';
import { HttpModule } from '@nestjs/axios';
import { EventsModule } from 'src/events/events.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    FilesModule,
    HttpModule,
    EventsModule,
    JwtModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
