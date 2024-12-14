const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		avatar: {
			publicId: String,
			url: String,
		},
		name: {
			type: String,
			required: true,
		},
		bio: {
			type: String,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			select: false,
			required: true,
		},
		posts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'post',
			},
		],
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'user',
			},
		],
		followings: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'user',
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('user', userSchema);
