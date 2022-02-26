import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import Comment from './Comment';
import Movie from './Movie';
import Actor from './Actor';
import Like from './Like';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  auth: string;

  @OneToMany(() => Movie, (movie) => movie.userId)
  movie: Movie[];

  @OneToMany(() => Actor, (actor) => actor.userId)
  actor: Actor[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  like: Like[];
}

export default User;
