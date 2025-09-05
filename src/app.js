const express = require('express');
const connectDB = require('./config/database.js');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth} = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser());

// Signup api
app.post("/signup", async (req,res) => { 
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

// Login api 
app.post("/login", async (req,res) => {

    try {
       const { emailId, password} = req.body;

       const user = await User.findOne({ emailId: emailId});
       if (!user) {
        throw new Error("Invalid credential");               
       }
       
       const isPasswordValid = await bcrypt.compare(password, user.password);

       if (isPasswordValid) {

        //Create a JWT Token

        const token = await jwt.sign({_id: user._id }, "DEV@TINDER");

        // Add a token to cookie and send the response back to the user
        res.cookie("token", token);


        res.send("login successfully!!");
       } 
       else {
        throw new Error("Invalid credential");               
       }
       
    
    } catch (err) {
        res.status(400).send("Error : " + err.message);
        
    }
})

// profile api 
app.get("/profile", userAuth, async (req,res) => {
    try {
        const user = req.user;

    res.send( user);
    } catch (err) {
        res.status(400).send("Error : " + err.message);

    }    
});

app.post("/sendConnectionRequest",userAuth, async (req,res) => {
    const user = req.user;
    // Sending the connection request
    console.log("sending the connection request");

    res.send(user.firstName + " sent the connection request"); 

});

connectDB()
.then(()=> {
console.log("database connected");
app.listen(7777, () =>{
    console.log('Server is succesfully connected to port 7777');

});
})
.catch(err=>{
console.log("database not connected");
   
});

