const User = require("../models/User");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { REFRESH_TOKEN_PRIVATE_KEY, ACCESS_TOKEN_PRIVATE_KEY } = require("../configs/configs");
const { success, error } = require("../utils/responseWrapper");





const signUplController = async (req, res)=>{
    try {
        const { name, email, password} = req.body;
        
		if (!email && !password && !name) {
            return res.send(error(400, 'Name, Email & Password are required'));
			// return res.status(400).send(' Name ,Email & Password are required');
		}
        if (!name) {
			// return res.status(400).send('name is required');
			return res.send(error(400, 'Name is requred'));
		}
        if (!email) {
			// return res.status(400).send('Email is required');
			// return res.status(400).send('Email is required');
			return res.send(error(400, 'Email is requred'));
		}

		if (!password) {
			// return res.status(400).send('Password is required');
			// return res.status(400).send('Password is required');
			return res.send(error(400, 'Password is required'));
        }
		
        const existingUser = await User.findOne({ email });
		if (existingUser) {
            return res.send(error(409, 'User is already registered'));
            // return res.status(409).send('User is already registered');
		}


        const hashedPassword = await bcrypt.hash(password, 10);

        const nweUser = await User.create({
            name,
			email,
			password: hashedPassword,
		});
		const accessToken = generateAccessToken({
			_id: nweUser._id,
		});
		const refreshToken = generateRefreshToken({
			_id: nweUser._id,
		});
		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			secure: true,
		});
        return res.json(success(201, {accessToken, refreshToken, user:nweUser}));

    
    } catch (err) {
        console.log(err);
    }
}

const loginController = async (req, res)=>{
    try {
        const {email, password } = req.body;

        if(!email && !password){
            return res.send(error(400, 'Email & Password are required'));
            // return res.status(400).send('email and password are required')
        }
        const user = await User.findOne({email})

        if(!user){
            return res.send(error(404, 'User is not registered'));
            // return res.status(404).send("User is not found")
        }

        const CorrectPassword = await bcrypt.compare(password, user.password)


        if(!CorrectPassword){
            return res.send(error(403, 'Incorrect password'));
		}
            // return res.status(403).send('incorrect password')
        

        const accessToken = generateAccessToken({
            _id: user._id
        })

        const refreshToken = generateRefreshToken({
            _id: user._id
        })

     res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true
     })

     return res.json(success(200, {accessToken, refreshToken,  user}));
	
    } catch (err) {
        console.log(err);
    }
}
const refreshAccessTokenController = async (req, res) => {
	const { refreshToken } = req.body;

	if (!refreshToken) {
		return res.send(error(401, 'Refresh token is required'));
	}

	try {
		const decode = jwt.verify(refreshToken, REFRESH_TOKEN_PRIVATE_KEY);

		const _id = decode._id;

		const newAccessToken = generateAccessToken({ _id });

		return res.send(success(201, { newAccessToken }));
	} catch (err) {
		return res.send(error(500, err.message));
	}
};

const generateAccessToken = (data) => {
	try {
		const accessToken = jwt.sign(data, ACCESS_TOKEN_PRIVATE_KEY, {
			expiresIn: '15m',
		});
		//Let's see what this token is returning actually.
		console.log(accessToken);
		return accessToken;
	} catch (err) {
		console.log(err);
	}
};
const generateRefreshToken = (data) => {
	try {
		const refreshToken = jwt.sign(data, REFRESH_TOKEN_PRIVATE_KEY, {
			expiresIn: '1y',
		});
		return refreshToken;
	} catch (err) {
		console.log(err);
	}
};



module.exports = {
    loginController,
    signUplController,
    refreshAccessTokenController,
}