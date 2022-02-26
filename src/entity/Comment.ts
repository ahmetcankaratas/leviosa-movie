import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import Movie from './Movie';
import Actor from './Actor';
import User from './User';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.comment, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.comment, {
    eager: true,
    onDelete: 'CASCADE',
  })
  movie: Movie;

  @ManyToOne(() => Actor, (actor) => actor.comment, {
    eager: true,
    onDelete: 'CASCADE',
  })
  actor: Actor;
}

export default Comment;
