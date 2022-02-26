import { Router } from 'express';
import * as movieController from '../controllers/movieController';
import { checkJwt } from '../middleware/checkJwt';

const router = Router();

// GET
router.get('/', movieController.getMovies);
router.get('/:id', movieController.getMovieById);
router.get('/edit/:id', checkJwt, movieController.getMovieEditById);

// POST
router.post('/:id/comments', checkJwt,movieController.newComment);
router.post('/:id/likes', checkJwt,movieController.newLike);

// UPDATE
router.put('/edit/:id', checkJwt,movieController.updateMovieById);
router.put('/share/:id',checkJwt, movieController.shareMovieById);

// DELETE
router.delete('/:id', checkJwt,movieController.deleteMovieById);
router.delete('/:id/likes/:likeId',checkJwt, movieController.removeLike);

export default router;
