import { Router } from 'express';
import * as actorController from '../controllers/actorController';
import { checkJwt } from '../middleware/checkJwt';

const router = Router();

// GET
router.get('/', actorController.getActors);
router.get('/:id', actorController.getActorById);
router.get('/edit/:id', checkJwt, actorController.getActorEditById);

// POST
router.post('/:id/comments', checkJwt, actorController.newComment);
router.post('/:id/likes', checkJwt, actorController.newLike);

// UPDATE
router.put('/edit/:id', checkJwt, actorController.updateActorById);
router.put('/share/:id', checkJwt, actorController.shareActorById);

// DELETE
router.delete('/:id', checkJwt, actorController.deleteActorById);
router.delete('/:id/likes/:likeId', checkJwt, actorController.removeLike);

export default router;
