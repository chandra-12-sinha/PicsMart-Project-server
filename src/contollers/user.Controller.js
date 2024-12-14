
const User = require('../models/User');
const Post = require('../models/Post.js');
const { error, success } = require('../utils/responseWrapper');
const utils = require('../utils/utils.js');
const cloudinary = require('cloudinary').v2;

const followOrUnfollowController = async (req, res) => {
	const { userIdToFollow } = req.body;
	const curUserId = req._id;

	if (userIdToFollow === curUserId) {
		return res.send(error(409, 'Cannot follow yourself'));
	}

	if (!userIdToFollow) {
		return res.send(error(400, 'User id to follow is required'));
	}

	//finding user that we will follow
	const userToFollow = await User.findById(userIdToFollow);

	if (!userToFollow) {
		return res.send(error(404, 'User to follow not found'));
	}

	//finding current user
	const curUser = await User.findById(curUserId);

	if (!curUser) {
		return res.send(error(404, 'Current user not found'));
	}

	//if followed, make them unfollow -
	if (curUser.followings.includes(userIdToFollow)) {
		try {
			const followingIndex = curUser.followings.indexOf(userIdToFollow);
			curUser.followings.splice(followingIndex, 1);

			const followerIndex = userToFollow.followers.indexOf(curUserId);
			userToFollow.followers.splice(followerIndex, 1);

			//save both users
			await userToFollow.save();
			await curUser.save();

			return res.send(success(200, 'user unfollowed'));
		} catch (err) {
			return res.send(error(500, err.message));
		}
	} else {
		//not following? make them follow
		try {
			userToFollow.followers.push(curUserId);
			curUser.followings.push(userIdToFollow);

			console.log(userToFollow);

			//save
			await userToFollow.save();
			await curUser.save();

			return res.send(success(201, 'user followed'));
		} catch (err) {
			return res.send(error(500, err.message));
		}
	}
};

const deleteMyProfileController = async (req, res) => {
	try {
		const curUserId = req._id;

		const curUser = await User.findById(curUserId);

		await Post.deleteMany({
			owner: curUserId,
		});

		curUser.followers.forEach(async (followerId) => {
			const follower = await User.findById(followerId);
			const index = follower.followings.indexOf(curUserId);
			follower.followings.splice(index, 1);
			await follower.save();
		});

		curUser.followings.forEach(async (followingId) => {
			const following = await User.findById(followingId);
			const index = following.followers.indexOf(curUserId);
			following.followers.splice(index, 1);
			await following.save();
		});

		const allPost = await Post.find();
		allPost.forEach(async (post) => {
			const index = post.likes.indexOf(curUserId);
			post.likes.splice(index, 1);
			await post.save();
		});

		await curUser.deleteOne();

		res.clearCookie('jwt', {
			httpOnly: true,
			secure: true,
		});

		return res.send(success(200, 'User profile deleted'));
	} catch (err) {
		return res.send(error(500, err.message));
	}
};

const getMyInfoController = async (req, res) => {
	try {
		const userId = req._id;

		const user = await User.findById(userId);

		return res.send(success(200, { user }));
	} catch (err) {
		return res.send(error(500, err.message));
	}
};

const updateUserProfile = async (req, res) => {
	try {
		const { name, bio, userImg } = req.body;
		const user = await User.findById(req._id);

		if (name) {
			user.name = name;
		}

		if (bio) {
			user.bio = bio;
		}

		if (userImg) {
			const cloudImg = await cloudinary.uploader.upload(userImg, {
				folder: 'profileImg',
			});

			user.avatar = {
				url: cloudImg.secure_url,
				publicId: cloudImg.public_id,
			};

			await user.save();

			return res.send(success(200, { user }));
		}
	} catch (err) {
		return res.send(error(500, err.message));
	}
};

const getUserProfile = async (req, res) => {
	try {
		const { userId } = req.body;

		const user = await User.findById(userId).populate({
			path: 'posts',
			populate: {
				path: 'owner',
			},
		});

		const fullPost = user.posts;

		const posts = fullPost.map((post) => utils(post, req._id)).reverse();

		return res.send(success(200, { ...user._doc, posts }))
	} catch (err) {
		return res.send(error(500, err.message));
	}
};

module.exports = {
	followOrUnfollowController,
	deleteMyProfileController,
	getMyInfoController,
	updateUserProfile,
	getUserProfile,
};
