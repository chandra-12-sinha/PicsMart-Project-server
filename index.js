const cookieParser = require('cookie-parser');
const express = require('express')
const morgan = require('morgan');
const mainRouter = require('./src/routes/index');
const cors = require('cors')
const dbConnect = require('./src/configs/dbConnect');
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, PORT } = require('./src/configs/configs');
const cloudinary = require('cloudinary').v2

const app = express();

// Configure cloudinary
cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
});

//middlewares
app.use(express.json({limit: "60mb"}));
app.use(morgan('common'));
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:3000',
	})
);

//default route
app.get('/', (req, res) => {
	res.json({
		status: 'Working at full capacity!',
	});
});

//main routes
app.use('/', mainRouter);

//listening on port
app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});

dbConnect()
