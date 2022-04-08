import { Request, Response } from 'express';
import * as google from './auth.google';
import * as facebook from './auth.facebook';
import * as check from '../functions/checkLogin';
import { Movie } from '../entity/Movie';
import { Actor } from '../entity/Actor';

// Render - adding movie page
export const getMovieAdd = async (req: Request, res: Response) => {
  res.render('add-movie', { user: await check.user(req) });
};

// Render - profile page
export const getProfile = async (req: Request, res: Response) => {
  res.render('profile', { user: await check.user(req) });
};

// Render - adding actor page
export const getActorAdd = async (req: Request, res: Response) => {
  res.render('add-actor', { user: await check.user(req) });
};

// Render - home page
export const getIndex = async (req: Request, res: Response) => {
  // Get movie's and actor's details from the database

  // Get last added editor 9 movies
    const editor = await Movie.find({
    where: {
      userId: 1,
      isPublic: true,
    },
    order: {
      id: 'DESC',
    },
    take: 4,
  });

  // Get last added 4 movie
  const movie = await Movie.find({
    where: {
      isPublic: true,
    },
    order: {
      id: 'DESC',
    },
    take: 6,
  });

  // Get last added 4 actors
  const actor = await Actor.find({
    where: {
      isPublic: true,
    },
    order: {
      id: 'DESC',
    },
    take: 6,
  });

  res.render('index', {
    user: await check.user(req),
    google: google.loginUrl(),
    facebook: facebook.loginUrl(),
    editor: editor,
    movies: movie,
    actors: actor,
  });
};
