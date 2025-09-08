const express = require("express");
const authRouter = express.Router();
const User = require('./models/user');
const bcrypt = require("bcrypt");



authRouter.post("/signup", async (req,res) => { 
try{    
    
// Validation of data 
validateSignUpData(req);

const {firstName, lastName, emailId, password} = req.body  ;

// Encrypt the password
const passwordHash = await bcrypt.hash(password, 10);
console.log(passwordHash);


// Crreating the new instance of user model    
const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
});


    await user.save();
    res.send("User added successfully");
     } catch (err) {
    res.status(400).send("Error : " + err.message);
   }
});

authRouter.post("/login", async (req,res) => {

    try {
       const { emailId, password} = req.body;

       const user = await User.findOne({ emailId: emailId});
       if (!user) {
        throw new Error("Invalid credential");               
       }
       
       const isPasswordValid = await user.validatePassword(password);

       if (isPasswordValid) {

        //Create a JWT Token

        const token = await user.getJWT();

        // Add a token to cookie and send the response back to the user
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        });


        res.send("login successfully!!");
       } 
       else {
        throw new Error("Invalid credential");               
       }
       
    
    } catch (err) {
        res.status(400).send("Error : " + err.message);
        
    }
});

module.exports = authRouter;