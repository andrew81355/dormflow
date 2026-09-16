const jwt = require('jsonwebtoken');
const User = require('../models/User');
//it check token from request  and verify it and then add user to request
// routes usingmiddleware function  to auth user with a valid token
async function auth(req, res, next) {
    const header = req.headers.authorization;
    // header "Beared <token>" requiterd for authorization
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({error: 'Unathorized'});
    }
    const token = header.split(" ")[1];
    let decoded;
    //verify token
    try {decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({error: 'invalid token'});
    }
    try {const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({error: 'auth required'})
        }
        req.user = user;
        next();

    } catch (error) {
        next(error);
    }
    }
module.exports = auth;
