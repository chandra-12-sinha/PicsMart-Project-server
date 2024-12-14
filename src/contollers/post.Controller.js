const Post = require('../models/Post');
const User = require('../models/User');
const { success, error } = require('../utils/responseWrapper');
const utils = require('../utils/utils');
const cloudinary = require('cloudinary').v2;

const createPostController = async (req, res) => {
	const { caption, postImg } = req.body;

	if (!caption || !postImg) {
		return res.send(error(400, 'Caption and Image are required'));
	}

	const cloudImg = cloudinary.uploader.upload(postImg, {
		folder: 'postImg',
	});

	const owner = req._id;

	const user = await User.findById(owner);
	console.log(user);

	if (!user) {
		return res.send(error(404, 'user not found'));
	}

	try {
		const post = await Post.create({
			owner,
			caption,
			image: {
				url: (await cloudImg).secure_url,
				publicId: (await cloudImg).public_id,
			},
		});

		//add to user -
		user.posts.push(post._id);
		await user.save();

		return res.send(success(201, { post }));
	} catch (err) {
		return res.send(error(500, err.message));
	}
};

const likeAndUnlikeController = async (req, res) => {
	const { postId } = req.body;
	const curUserId = req._id;

	const post = await Post.findById(postId);

	if (!post) {
		return res.send(error(404, 'Post not found'));
	}

	//already liked
	if (post.likes.includes(curUserId)) {
		try {
			const index = post.likes.indexOf(curUserId);
			post.likes.splice(index, 1);
		} catch (err) {
			return res.send(error(500, err.message));
		}
	} else {
		//not liked, will be liked now
		try {
			post.likes.push(curUserId);
		} catch (err) {
			return res.send(error(500, err.message));
		}
	}

	post.save();
	return res.send(success(200, { post: utils(post, req._id) }));
};

const getAllPostOfFollowings = async (req, res) => {
	try {
		const curUserId = req._id;
		const curUser = await User.findById(curUserId);

		const posts = Post.find({
			owner: {
				$in: curUser.followings,
			},
		});

		return res.send(success(200, posts));
	} catch (err) {
		return res.send(error(500, err.message));
	}
};

const deletePostController = async (req, res) => {
	try {
		const { postId } = req.body;
		const curUserId = req._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.send(error(404, 'Post not found'));
		}

		if (post.owner.toString() !== curUserId) {
			return res.send(error(403, 'Only owners can delete their posts'));
		}

		const user = await User.findById(curUserId);

		const index = user.posts.indexOf(postId);
		user.posts.splice(index, 1);

		await user.save();

		await post.deleteOne();

		return res.send(success(200, 'Post updated successfully'));
	} catch (err) {
		return res.send(error(500, err.message));
	}
};

const getMyPostsController = async (req, res) => {
	try {
		const curUserId = req._id;

		const allUserPosts = await Post.find({
			owner: {
				$in: curUserId,
			},
		}).populate('likes');

		return res.send(success(200, { allUserPosts }));
	} catch (err) {
		return res.send(error(500, err.message));
	}
};

const getUserPostController = async (req, res) => {
	try {
		const { userId } = req.body;

		if (!userId) {
			return res.send(error(400, 'User id is required'));
		}

		const allUserPost = await Post.find({
			owner: {
				$in: userId,
			},
		}).populate('likes');

		return res.send(success(200, { allUserPost }));
	} catch (err) {
		return res.send(error(500, err.message));
	}
};

module.exports = {
	createPostController,
	likeAndUnlikeController,
	getAllPostOfFollowings,
	deletePostController,
	getMyPostsController,
};
