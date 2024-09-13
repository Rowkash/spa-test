import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'comments' })
export class CommentEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.comments, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ApiProperty({ example: 'This is great comment!' })
  @Column()
  value: string;

  @ApiProperty({ example: 'http://home-page.com' })
  @Transform(({ value }) => value ?? undefined)
  @Column({ nullable: true })
  homePage?: string;

  @Transform(({ value }) => value ?? undefined)
  @Column({ nullable: true })
  file: string;

  @ManyToOne(() => CommentEntity, (comment) => comment.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent: CommentEntity;

  @Expose()
  @Transform(({ value }) => (value?.length > 0 ? value : undefined))
  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  children: CommentEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
