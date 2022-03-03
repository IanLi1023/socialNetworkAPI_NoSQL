const router = require('express').Router();
const thoughtRoutes = require('./thought');
const userRoutes = require('./user');

router.use('/thoughts', thoughtRoutes);
// add prefix of `/users` to routes created in `user.js`
router.use('/users', userRoutes);

module.exports = router;