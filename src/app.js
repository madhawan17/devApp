const express = require('express');
const connectDB = require('./config/database.js');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");

app.use(express.json());

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
       
       const isPasswordValid = await bcrypt.compare(password);

       if (isPasswordValid) {
        res.send("login successfully!!");
       } 
       else {
        throw new Error("Invalid credential");               
       }
       
    
    } catch (err) {
        res.status(400).send("Error : " + err.message);
        
    }
})



// Get users by email 
app.get("/user", async (req,res) => {
    const userEmail = req.body.emailId;

    try {
        const users = await User.find({emailId: userEmail});
        if (users.length === 0 ) {
            res.status(404).send("User not found");
        } else {
            res.send(users);

        }

        
    }
    catch (err) {
        res.status(400).send("Something went wrong!!")

    }
});

// Feed API - get / feed - get all the users from the database
app.get("/feed", async (req,res) =>{
    try {
        const users = await User.find({});
        res.send (users);
    }
    catch (err) {
        res.status(400).send("Something went wrong!!")
    }


} );

// deleting user 
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const users = await User.findByIdAndDelete(userId);
        res.send ("user delete successfully");
    }
    catch (err) {
        res.status(400).send("Something went wrong!!")
    }

} );

// Update data of the user 
app.patch("/user/:userId", async (req,res) => {
    const userId = req.params?.userId;
    const data = req.body;


    try {
        const ALLOWED_UPDATES = [
        "photourl", "about", "age", "gender", "skills"
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
         ALLOWED_UPDATES.includes(k)
    );

    if(!isUpdateAllowed) {
        throw new Error("Updatessss not allowed");
    }

    if(data?.skills.length > 10) {
        throw new Error("Skills cannot be more than 10");
    }

         const user = await User.findByIdAndUpdate({_id: userId}, data, {
            returnDocument: "after",
            runValidators: true,
        } );
         console.log(user);
        res.send ("user updated successfully");
    }
    catch (err) {
        res.status(400).send("Update failed:"  + err.message);
    }

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

