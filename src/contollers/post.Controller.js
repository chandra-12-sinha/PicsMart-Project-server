const { success } = require("../utils/responseWrapper");

const getAllPostsController = async (req, res) => {
	return res.send(success(200, 'here are all the posts'));
};
module.exports = {
	getAllPostsController,
};