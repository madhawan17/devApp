const express = require('express');

const app = express();

const { adminAuth, userAuth } = require("./middleware/auth");

app.use("/admin, adminAuth");

app.get("/user",  (req, res) => {
    res.send("User data sent");
});

app.get("/admin/getAllData", (req, res) => {
    res.send("All data sent");
});

app.get("/admin/deleteUser", (req, res) => {
    res.send("Deleted a user");
});



app.listen(7777, () =>{
    console.log('Server is succesfully connected to port 7777');

});