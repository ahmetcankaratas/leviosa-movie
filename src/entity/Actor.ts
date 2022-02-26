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
export class Actor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column()
  biography: string;

  @Column()
  poster: number;

  @Column()
  isPublic: boolean;

  // @Column()
  // userId: number;

  @ManyToOne(() => User, (userId) => userId.actor, {
    eager: true,
    onDelete: 'CASCADE',
  })
  userId: User;

  @OneToMany(() => Comment, (comment) => comment.actor)
  comment: Comment[];

  @OneToMany(() => Like, (like) => like.actor)
  like: Like[];
}

export default Actor;
