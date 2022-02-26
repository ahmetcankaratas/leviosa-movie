import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import User from './User';
import Comment from './Comment';
import Like from './Like';

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  overview: string;

  @Column()
  poster: number;

  @Column()
  isPublic: boolean;

  @ManyToOne(() => User, (userId) => userId.movie, {
    eager: true,
    onDelete: 'CASCADE',
  })
  userId: User;

  @OneToMany(() => Comment, (comment) => comment.movie)
  comment: Comment[];

  @OneToMany(() => Like, (like) => like.movie)
  like: Like[];
}

export default Movie;
