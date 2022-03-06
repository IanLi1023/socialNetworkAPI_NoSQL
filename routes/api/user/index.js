const router = require('express').Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  addToFriendList,
  // removefromFriendList
} = require('../../../controllers/userController.js');

// Set up GET all and POST at /api/users. Provide name of controller as callback
router.route('/')
  .get(getAllUsers)
  .post(createUser);

// Set up GET one, PUT, and DELETE at /api/users/<id>
router.route('/:userId')
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

router.route('/:userId/friends/:friendId')
  .post(addToFriendList);


// router.route('/:userId/friends/:friendId')
//   .delete(removefromFriendList);

module.exports = router;