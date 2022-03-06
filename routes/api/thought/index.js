const router = require('express').Router();

const {
  addThought,
  getAllThoughts,
  getThoughtById,
  updateThoughtById,
  removeThoughtById,
  addReaction,
  removeReaction,
} = require('../../../controllers/thoughtController');

// /api/thoughts
router.route('/')
  .post(addThought)
  .get(getAllThoughts);

router.route('/:userId')
  .get(getThoughtById)
  .put(updateThoughtById)
  .delete(removeThoughtById);

router
  .route('/:thoughtId/reactions')
  .post(addReaction);

router
  .route('/:thoughtId/reactions/:reactionId')
  .delete(removeReaction);

module.exports = router;