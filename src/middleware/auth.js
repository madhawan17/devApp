const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    // Read the token from the request cookies
    try{
    const {token} = req.cookies;
    if(!token) {
        throw new Error("Tokenis not valid!!!!");
    }

    const decodeObj = await jwt.verify(token, "DEV@TINDER");

    const {_id} = decodeObj;

    const user = await User.findById(_id);
    if (!user) {
        throw new Error("User not found");
    }
    next();
}
catch(err){
    res.status(400).send("ERROR : " + err.message);
}

    // Find the username
 };

 module.exports = { userAuth};