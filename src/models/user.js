const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error ("Invalid email address:" + value);
            }
        },
    },
    password : {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error ("Enter a strong pasword:" + value);
            }
        },
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        min: 18,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Not a valid gender");
            }
        },
    },
    photoUrl: {
        type: String,                                   
    },
    about: {
        type: String,
        default: "This is the default about of the user!",
    },
    skills: {
        type: [String],
    },
},
{
    timestamps: true,
}
);

userSchema.methods.getJWT = async function () {
    const user = this ;

    const token = await jwt.sign({_id : user._id}, "DEV@TINDER", {
        expiresIn : "7d"
    });

    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this ;
    const passwordHash = user.password;


    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);
