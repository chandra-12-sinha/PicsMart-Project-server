const User = require("../models/User");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { REFRESH_TOKEN_PRIVATE_KEY, ACCESS_TOKEN_PRIVATE_KEY } = require("../configs/configs");





const signUplController = async (req, res)=>{
    try {
        const {email, password} = req.body;
        
		if (!email && !password) {
			return res.status(400).send('Email & Password are required');
		}
		
		if (!email) {
			return res.status(400).send('Email is required');
		}
		if (!password) {
			return res.status(400).send('Password is required');
		}
        const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).send('User is already registered');
		}
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
			email,
			password: hashedPassword,
		});
		return res.status(201).json({
			user,
		});
    
    } catch (err) {
        console.log(err);
    }
}

const loginController = async (req, res)=>{
    try {
        const {email, password } = req.body;

        if(!email || !password){
            return res.status(400).send('email and password are required')
        }
        const user = await User.findOne({email})

        if(!user){
            return res.status(404).send("User is not found")
        }

        const CorrectPassword = await bcrypt.compare(password, user.password)


        if(!CorrectPassword){
            return res.status(403).send('incorrect password')
        }

        const accessToken = generateAccessToken({
            _id: user._id
        })

        const refreshToken = generateRefreshToken({
            _id: user._id
        })

        return res.json({
            accessToken:accessToken,
            refreshToken:refreshToken
        })

    } catch (err) {
        console.log(err);
    }
}
const refreshAccessTokenController = async (req, res) => {
	const { refreshToken } = req.body;
	if (!refreshToken) {
		return res.status(401).send('Refresh token is required');
	}
	try {
		const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_PRIVATE_KEY);
		const _id = decoded._id;
		const newAccessToken = generateAccessToken({ _id });
		return res.status(201).json({
			newAccessToken,
		});
	} catch (err) {
		console.log(err);
		return res.status(401).send('Invalid refresh token');
	}
};
//Internal functions which we will not be exporting
const generateAccessToken = (data) => {
	try {
		//This jwt.sign function asks us two arguments, one the data we want to encrypt and other the secret key which only you will know/any random string.
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