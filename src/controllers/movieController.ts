import { Request, Response } from 'express';
import { Movie } from '../entity/Movie';
import { Comment } from '../entity/Comment';
import { Like } from '../entity/Like';
import { User } from '../entity/User';
import * as validation from '../validations/validation';
import * as check from '../functions/checkLogin';

// Create movie
export const newMovie = async (req: Request, res: Response) => {
  const currentUserId = req.session.userID;
  const { name, overview, isPublic } = req.body;

  const newMovie = new Movie();
  newMovie.name = name;
  newMovie.overview = overview;
  newMovie.poster = Math.floor(Math.random() * 10);
  newMovie.isPublic = isPublic;
  newMovie.userId = currentUserId;

  // Validate before we send the information to DB
  const { error } = validation.movie(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details[0].message });
  }

  // Save new movie to the database
  try {
    await Movie.save(newMovie);
    res.status(200).json({ message: 'Movie is created succesfully' });
  } catch (err) {
    throw new Error();
  }
};

// Read user's movies
export const getMovieListByUserId = async (req: Request, res: Response) => {
  const currentUserId = req.session.userID;

  // Get user's movies from the database
  try {
    const data = await Movie.find({
      where: { userId: currentUserId },
    });
    res.render('profile', { user: await check.user(req), data: data });
  } catch (err) {
    throw new Error();
  }
};

// Read all movies
export const getMovies = async (req: Request, res: Response) => {
  // Get all movies(shared) from the database
  try {
    const data = await Movie.find({
      where: { isPublic: true },
    });
    res.render('movie-list', { user: await check.user(req), data: data });
  } catch (err) {
    throw new Error();
  }
};

// Read movie's details
export const getMovieById = async (req: Request, res: Response) => {
  const currentMovieId = req.params.id;

  // Get movie's details from the database
  try {
    // Details
    const data = await Movie.find({
      where: {
        id: currentMovieId,
        isPublic: true,
      },
    });
    if (data.length > 0) {
      // Comments
      const comments = await Comment.createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .where('comment.movie.id = :id', {
          id: currentMovieId,
        })
        .getMany();

      // Likes
      const likes = await Like.find({
        where: { movie: currentMovieId },
      });
      // Current User Likes
      let userLike;
      likes.forEach((like) => {
        if (like.user.id == req.session.userID) {
          userLike = like.id;
        }
      });

      // Render Informations
      res.render('movie', {
        user: await check.user(req),
        movie: data[0],
        comments: comments,
        likes: likes,
        userLike: userLike,
      });
    } else {
      res.status(404).render('404', { errors: 'Movie not found' });
    }
  } catch (err) {
    throw new Error();
  }
};

// Get movie's details to update
export const getMovieEditById = async (req: Request, res: Response) => {
  const currentMovieId = req.params.id;

  // Get movie's details from the database
  try {
    const data = await Movie.findOneOrFail({
      where: { id: currentMovieId },
    });
    res.render('edit-movie', { user: await check.user(req), movie: data });
  } catch (error) {
    res.status(404).render('404', { errors: 'Movie not found' });
  }
};

// Update movie's details
export const updateMovieById = async (req: Request, res: Response) => {
  const currentMovieId = req.params.id;
  const { name, overview, isPublic } = req.body;

  const updatedMovie = new Movie();
  updatedMovie.name = name;
  updatedMovie.overview = overview;
  updatedMovie.isPublic = isPublic;

  // Check if the movie is in the DB
  try {
    await Movie.findOneOrFail(currentMovieId);
  } catch (error) {
    res.status(404).render('404', { errors: 'Movie not found' });
  }

  // Validate before we send the information to DB
  const { error } = validation.movie(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details[0].message });
  }

  // Update movie's details
  try {
    await Movie.update(currentMovieId, updatedMovie);
    res.status(200).json({ message: 'Movie is updated succesfully' });
  } catch (err) {
    throw new Error();
  }
};

// Update movie's share detail
export const shareMovieById = async (req: Request, res: Response) => {
  const currentMovieId = req.params.id;

  const shareMovie = new Movie();
  shareMovie.isPublic = true;

  // Check if the movie is in the DB
  try {
    await Movie.findOneOrFail(currentMovieId);
  } catch (error) {
    res.status(404).render('404', { errors: 'Movie not found' });
  }

  // Update movie's share detail
  try {
    await Movie.update(currentMovieId, shareMovie);
    res.status(200).json({ message: 'Movie is shared' });
  } catch (err) {
    throw new Error();
  }
};

// Delete movie
export const deleteMovieById = async (req: Request, res: Response) => {
  const currentMovieId = req.params.id;

  // Check if the movie is in the DB
  try {
    await Movie.findOneOrFail(currentMovieId);
  } catch (error) {
    res.status(404).render('404', { errors: 'Movie not found' });
  }

  // Delete movie from database
  try {
    await Movie.delete(parseInt(currentMovieId));
    res.status(200).json({ message: 'Movie is deleted succesfully' });
  } catch (error) {
    throw new Error();
  }
};

// Create comment
export const newComment = async (req: Request, res: Response) => {
  const currentMovieId = req.params.id;
  const currentUserId = req.session.userID;

  let movie;
  try {
    movie = await Movie.findOneOrFail(currentMovieId);
  } catch (error) {
    res.status(404).render('404', { error: 'Movie not found' });
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
  comment.movie = movie;

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
  const currentMovieId = req.params.id;
  const currentUserId = req.session.userID;

  let movie;
  try {
    movie = await Movie.findOneOrFail(currentMovieId);
  } catch (error) {
    res.status(404).render('404', { error: 'Movie not found' });
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
  like.movie = movie;

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
