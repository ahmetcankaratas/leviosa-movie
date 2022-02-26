import { Request, Response } from 'express';
import { Actor } from '../entity/Actor';
import { Comment } from '../entity/Comment';
import { Like } from '../entity/Like';
import { User } from '../entity/User';
import * as validation from '../validations/validation';
import * as check from '../functions/checkLogin';

// Create actor
export const newActor = async (req: Request, res: Response) => {
  const currentUserId = req.session.userID;
  const { fullname, biography, isPublic } = req.body;

  const newActor = new Actor();
  newActor.fullname = fullname;
  newActor.biography = biography;
  newActor.poster = Math.floor(Math.random() * 10);
  newActor.isPublic = isPublic;
  newActor.userId = currentUserId;

  // Validate before we send the information to DB
  const { error } = validation.actor(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details[0].message });
  }

  // Save new actor to the database
  try {
    await Actor.save(newActor);
    res.status(200).json({ message: 'Actor is created succesfully' });
  } catch (err) {
    throw new Error();
  }
};

// Read user's actors
export const getActorListByUserId = async (req: Request, res: Response) => {
  const currentUserId = req.session.userID;

  // Get user's actors from the database
  try {
    const data = await Actor.find({
      where: { userId: currentUserId },
    });
    res.render('my-actors', { user: await check.user(req), data: data });
  } catch (err) {
    throw new Error();
  }
};

// Read all actors
export const getActors = async (req: Request, res: Response) => {
  // Get all actors(shared) from the database
  try {
    const data = await Actor.find({ where: { isPublic: true } });
    res.render('actor-list', { user: await check.user(req), data: data });
  } catch (err) {
    throw new Error();
  }
};

// Read actor's details
export const getActorById = async (req: Request, res: Response) => {
  const currentActorId = req.params.id;

  // Get actor's details from the database
  try {
    // Details
    const data = await Actor.find({
      where: { id: currentActorId, isPublic: true },
    });

    if (data.length > 0) {
      // Comments
      const comments = await Comment.createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .where('comment.actor.id = :id', {
          id: currentActorId,
        })
        .getMany();

      // Likes
      const likes = await Like.find({
        where: { actor: currentActorId },
      });

      // Current User Likes
      let userLike;
      likes.forEach((like) => {
        if (like.user.id == req.session.userID) {
          userLike = like.id;
        }
      });

      // Render Informations
      res.render('actor', {
        user: await check.user(req),
        actor: data[0],
        comments: comments,
        likes: likes,
        userLike: userLike,
      });
    } else {
      res.status(404).render('404', { errors: 'Actor not found' });
    }
  } catch (err) {
    throw new Error();
  }
};

// Get actor's details to update
export const getActorEditById = async (req: Request, res: Response) => {
  const currentActorId = req.params.id;

  // Get actor's details from the database
  try {
    const data = await Actor.findOneOrFail({
      where: { id: currentActorId },
    });
    res.render('edit-actor', { user: await check.user(req), actor: data });
  } catch (error) {
    res.status(404).render('404', { errors: 'Actor not found' });
  }
};

// Update actor's details
export const updateActorById = async (req: Request, res: Response) => {
  const currentActorId = req.params.id;
  const { fullname, biography, isPublic } = req.body;

  const updatedActor = new Actor();
  updatedActor.fullname = fullname;
  updatedActor.biography = biography;
  updatedActor.isPublic = isPublic;

  // Check if the actor is in the DB
  try {
    await Actor.findOneOrFail(currentActorId);
  } catch (error) {
    res.status(404).render('404', { errors: 'Actor not found' });
  }

  // Validate before we send the information to DB
  const { error } = validation.actor(req.body);
  console.log(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details[0].message });
  }

  // Update actor's details
  try {
    await Actor.update(currentActorId, updatedActor);
    res.status(200).json({ message: 'Actor is updated succesfully' });
  } catch (err) {
    throw new Error();
  }
};

// Update actor's share detail
export const shareActorById = async (req: Request, res: Response) => {
  const currentActorId = req.params.id;

  const shareActor = new Actor();
  shareActor.isPublic = true;

  // Check if the actor is in the DB
  try {
    await Actor.findOneOrFail(currentActorId);
  } catch (error) {
    res.status(404).render('404', { errors: 'Actor not found' });
  }

  // Update actor's share detail
  try {
    await Actor.update(currentActorId, shareActor);
    res.status(200).json({ message: 'Actor is shared' });
  } catch (err) {
    throw new Error();
  }
};

// Delete actor
export const deleteActorById = async (req: Request, res: Response) => {
  const currentActorId = req.params.id;

  // Check if the actor is in the DB
  try {
    await Actor.findOneOrFail(currentActorId);
  } catch (error) {
    res.status(404).render('404', { errors: 'Actor not found' });
  }

  // Delete actor from database
  try {
    await Actor.delete(parseInt(currentActorId));
    res.status(200).json({ message: 'Actor is deleted succesfully' });
  } catch (error) {
    throw new Error();
  }
};

// Create comment
export const newComment = async (req: Request, res: Response) => {
  const currentActorId = req.params.id;
  const currentUserId = req.session.userID;

  let actor;
  try {
    actor = await Actor.findOneOrFail(currentActorId);
  } catch (error) {
    res.status(404).render('404', { error: 'Actor not found' });
  }

  let user;
  try {
    user = await User.findOneOrFail(currentUserId);
  } catch (error) {
    res.status(404).render('404', { error: "'User not found'" });
  }

  const { title, text } = req.body;
  const comment = new Comment();
  comment.title = title;
  comment.text = text;
  comment.user = user.id;
  comment.actor = actor;

  // Validate before we send the information to DB
  const { error } = await validation.comment(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details[0].message });
  }

  // Save new comment to the database
  try {
    await Comment.save(comment);
    res.status(201).json({ message: 'Comment created' });
  } catch (error) {
    throw new Error();
  }
};

// Create like
export const newLike = async (req: Request, res: Response) => {
  const currentActorId = req.params.id;
  const currentUserId = req.session.userID;

  let actor;
  try {
    actor = await Actor.findOneOrFail(currentActorId);
  } catch (error) {
    res.status(404).render('404', { error: 'Actor not found' });
  }

  let user;
  try {
    user = await User.findOneOrFail(currentUserId);
  } catch (error) {
    res.status(404).render('404', { error: "'User not found'" });
  }

  const like = new Like();
  like.isLike = true;
  like.user = user.id;
  like.actor = actor;

  // Save new like to the database
  try {
    await Like.save(like);
    res.status(201).json({ message: 'You like it' });
  } catch (error) {
    throw new Error();
  }
};

// Remove Like
export const removeLike = async (req: Request, res: Response) => {
  const currentLikeId = req.params.likeId;

  // Check if the like is in the DB
  let like;
  try {
    like = await Like.findOneOrFail(currentLikeId);
  } catch (error) {
    res.status(404).render('404', { errors: 'Like not found' });
  }
  console.log(like);
  // Delete like from database
  try {
    await Like.delete(like.id);
    res.status(200).json({ message: 'Like is deleted succesfully' });
  } catch (error) {
    throw new Error();
  }
};
