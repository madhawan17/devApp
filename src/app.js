const express = require('express');

const app = express();

app.use("/node",(req, res) => {
    res.send("namste from the dashboard");
});

app.use("/hello",(req, res) => {
    res.send("Hello hello hello");
});

app.use("/test",(req, res) => {
    res.send("Hello from the server!");
});

app.listen(7777, () =>{
    console.log('Server is succesfully connected to port 7777');

});