import { Router } from 'express';
import { checkJwt } from '../middleware/checkJwt';
import * as controller from '../controllers/userControllers';
import * as pageController from '../controllers/pageControllers';
import * as google from '../controllers/auth.google';
import * as facebook from '../controllers/auth.facebook';
import * as movieController from '../controllers/movieController';
import * as actorController from '../controllers/actorController';

const router = Router();

// GET
router.get('/profile', checkJwt, movieController.getMovieListByUserId);
router.get('/my-actors', checkJwt, actorController.getActorListByUserId);
router.get('/add-movie', checkJwt, pageController.getMovieAdd);
router.get('/add-actor', checkJwt, pageController.getActorAdd);
router.get('/logout', controller.logout);
router.get('/', pageController.getIndex);
router.get('/auth/google', google.auth);
router.get('/auth/facebook', facebook.auth);

// POST
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/new-movie', checkJwt, movieController.newMovie);
router.post('/new-actor', checkJwt, actorController.newActor);

export default router;
