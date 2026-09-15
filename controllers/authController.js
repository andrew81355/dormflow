const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
//create a new account
async function register(req, res, next) {
    try {
        const { name, email, password, roomNumber } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({error:'Name, email and password are required'});
    }
    const exising = await User.findOne({email:email.toLowerCase().trim()});
    if (existing) {
        return res.status(400).json({error:'Email already in use'});
    }
    const passwordHash = await User.create({name, email, passwordHash, roomNumber});
    // not returning hash for security
    res.status(201).jso({
        id:user._id,
        name:user.name,
        email:user.email,
        roomNumber:user.roomNumber,
        role:user.role,
    });
    } catch (err) {
        next(err);
    }
}
// check password annd return token
async function login(req, res, next) {
    try {
        const{email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({error:'Email and password are required'});
    }
    //find user by email and include passwordhash for verif
    const user = await User.findOne({
        email: email.toLowerCase().trim(),
    }).select('+passwordHash');
    // email or password for security
    if (!user) {
        return res.status(401).json({error:'Invalid email or password'});
    }
    // token show the user information and his role
    const token = jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET, {expiresIn:'7d'});
    res.json({token,
        user: {
            id:user._id,
            name:user.name,
            email: user.email,
            roomNumber:user.roomNumber,
            role:user.role,
        },
    });
    } catch (err) {
        next(err);

    }
}
//get data about user with token
function me(req, res) {
    // req.user got from auth middleware
    res.json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        roomNumber: req.user.roomNumber,
        role: req.user.role,
    });
} 
module.exports = {register, login, me};