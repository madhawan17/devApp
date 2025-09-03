const mongoose = require('mongoose');

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

    },
    password : {
        type: String,
        required: true
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

module.exports = mongoose.model("User", userSchema);
