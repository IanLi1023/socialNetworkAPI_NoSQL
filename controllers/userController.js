const { isEmail } = require('validator');
const { User } = require('../models');

module.exports = {
	createUser: async (req, res) => {
		const {
			username,
			email,
		} = req.body;
		if (!isEmail(email)) {
			return res.status(401).json({ error: 'Email must be a valid email address' });
		}
		try {
			const newUser = await User.create({
				username,
				email,
			});
			res.json(newUser);
		} catch (e) {
			res.json(e);
		}
	},
	getAllUsers: async (req, res) => {
		try {
			const users = await User.find()
				.populate({
					path: "thoughts",
					select: "-__v",
				})
				.select("-__v")
				.sort({ _id: -1 });
			res.json(users);
		} catch (e) {
			res.json(e);
		}
	},
	getUserById: async (req, res) => {
		const { userId } = req.params;
		try {
			const user = await User.findById(userId);
			res.json(user);
		} catch (e) {
			res.json(e);
		}
	},
	getUserById: async (req, res) => {
		const { userId } = req.params;
		try {
			const user = await User.findById(userId);
			res.json(user);
		} catch (error) {
			res.json(error);
		}
	},
	updateUserById: async (req, res) => {
		const { userId } = req.params;
		try {
			const updatedUser = await User.findByIdAndUpdate(
				userId,
				{ ...req.body },
				{
					new: true,
					runValidators: true,
				}
			);
			res.json(updatedUser);
		} catch (e) {
			res.json(e);
		}
	},
	deleteUserById: async (req, res) => {
		const { userId } = req.params;
		try {
			const deletedUser = await User.findByIdAndDelete(userId);
			res.json(deletedUser);
		} catch (e) {
			res.json(e);
		}
	},
	addToFriendList: async (req, res) => {
		const { userId, friendId } = req.params;
		try {
			const user1 = await User.findOneAndUpdate(
				{ _id: userId },
				{ $push: { friends: friendId } },
				{ new: true, runValidators: true }
			).populate({
				path: "friends",
				select: "-__v",
			});
			const user2 = await User.findOneAndUpdate(
				{ _id: friendId },
				{ $push: { friends: userId } },
				{ new: true, runValidators: true }
			)
				.populate({
					path: "friends",
					select: "-__v",
				})

				.select("-__v")
				.then((userData) => {
					if (!userData) {
						res.status(404).json({ message: "No User found with this id!" });
						return;
					}
					res.json(userData);
				});
		} catch (error) {
			res.json(error);
		}
	},
	removefromFriendList: async (req, res) => {
		const { userId, friendId } = req.params;
		try {
			const user1 = await User.findOneAndUpdate(
				{ _id: userId },
				{ $pull: { friends: friendId } },
				{ new: true, runValidators: true }
			)
			user1.populate({
				path: "friends",
				select: "-__v",
			});

			if (!user1) {
				res.status(404).json({ message: "No User found with this id!" });
				return;
			}
			const user2 = await User.findOneAndUpdate(
				{ _id: friendId },
				{ $pull: { friends: userId } },
				{ new: true, runValidators: true }
			)
			user2.populate({
				path: "friends",
				select: "-__v",
			})

			if (!user2) {
				res.status(404).json({ message: "No User found with this id!" });
				return;
			}

			res.json(user1);

		} catch (error) {
			res.json(error);
		}
	},
};
