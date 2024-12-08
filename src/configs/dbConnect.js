
const configs = require('./configs')
const { ServerApiVersion } = require("mongodb");
const { default: mongoose } = require("mongoose");


module.exports = async () => {
	const MONGO_URI = configs.MONGO_URI;
	try {
		const connect = await mongoose.connect(MONGO_URI, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			},
		});
		console.log(`MongoDB Connected ${connect.connection.host}`);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};