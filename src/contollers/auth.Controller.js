
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../models/User");
const { error, success } = require('../utils/responseWrapper');
const { REFRESH_TOKEN_PRIVATE_KEY, ACCESS_TOKEN_PRIVATE_KEY } = require('../configs/configs');

const signupController = async (req, res) => {
	try {
		const {  name, email, password } = req.body;

		if (!email || !password || !name) {
			// return res.status(400).send('email and password are required');
			return res.send(error(400, 'email and password are required'));
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			// return res.status(409).send('user is already registered');
			return res.send(error(409, 'user is already registered'));
		}

		//encrypt the password
		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
            name,
			email,
			password: hashedPassword,
		});

		const accessToken = await generateAccessToken({
			_id: newUser._id,
		});

		const refreshToken = await generateRefreshToken({
			_id: newUser._id,
		});

		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			secure: true,
		});

		// return res.status(201).json({
		// 	accessToken,
		// 	user: newUser,
		// });
		return res.send(
			success(201, { accessToken, refreshToken, user: newUser })
		);
	} catch (err) {
		// return res.status(500).send(err.message);
		return res.send(error(500, err.message));
	}
};

const loginController = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			// return res.status(400).send('email and password are required');
			return res.send(error(400, 'email and password are required'));
		}

		const user = await User.findOne({ email }).select('+password');

		if (!user) {
			// return res.status(409).send('user is not registered');
			return res.send(error(409, 'user is not registered'));
		}

		const correctPassword = await bcrypt.compare(password, user.password);

		if (!correctPassword) {
			// return res.status(403).send('Password is incorrect');
			return res.send(error(403, 'Password is incorrect'));
		}

		const accessToken = await generateAccessToken({
			_id: user._id,
		});

		const refreshToken = await generateRefreshToken({
			_id: user._id,
		});

		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			secure: true,
		});

		// console.log(accessToken);

		// return res.json({
		// 	accessToken: accessToken,
		// });
		return res.send(success(200, { accessToken, refreshToken, user }));
	} catch (err) {
		// return res.status(500).send(err.message);
		return res.send(error(500, err.message));
	}
};

const refreshAccessTokenController = async (req, res) => {
	const { refreshToken } = req.body;

	if (!refreshToken) {
		return res.send(error(401, 'Refresh token is required'));
	}

	try {
		const decode = jwt.verify(refreshToken, REFRESH_TOKEN_PRIVATE_KEY);

		const _id = decode._id;

		const newAccessToken = await generateAccessToken({ _id });

		return res.send(success(201, { newAccessToken }));
	} catch (err) {
		return res.send(error(500, err.message));
	}
};

//internal functions
const generateAccessToken = async (data) => {
	try {
		const token = jwt.sign(data, ACCESS_TOKEN_PRIVATE_KEY, {
			expiresIn: '1d',
		});

		return token;
	} catch (err) {
		// return res.status(500).send(err.message);
		console.log(err.message);
	}
};

const generateRefreshToken = async (data) => {
	try {
		const refreshToken = jwt.sign(data, REFRESH_TOKEN_PRIVATE_KEY, {
			expiresIn: '1y',
		});

		return refreshToken;
	} catch (err) {
		console.log(err.message);
	}
};

const logOutController = async (req, res) => {
	try {
		res.clearCookie('jwt', {
			httpOnly: true,
			secure: true,
		});

		return res.send(success(200, "User logged out"));
	} catch (err) {
		return res.send(error(500, err.message));
	}
};

module.exports = {
	signupController,
	loginController,
	refreshAccessTokenController,
	logOutController
};
