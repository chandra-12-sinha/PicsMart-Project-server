
const jwt = require('jsonwebtoken');
const { error } = require('../utils/responseWrapper');
const User = require('../models/User');
const { ACCESS_TOKEN_PRIVATE_KEY } = require('../configs/configs');

module.exports = async (req, res, next) => {
	if (!req.headers) {
		return res.send(error(401, "Headers is required"))
	}

	if (!req.headers.authorization) {
		return res.send(error(401, "Authorization in headers is required"));
	}

	if (!req.headers.authorization.startsWith("Bearer")) {
		return res.send(error(401, "It should start with Bearer protocol"))
	}

	const accessToken = req.headers.authorization.split(" ")[1];

	try {
		const decode = jwt.verify(accessToken, ACCESS_TOKEN_PRIVATE_KEY);

		req._id = decode._id;

		const user = await User.findById(req._id);

		if (!user) {
			return res.send(error(404, "user not Found"))
		}

		next();
	} catch (err) {
		console.log(err.message);
		return res.send(error(401, "Invalid Access Token"));
	}
};
