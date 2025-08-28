const express = require('express');

const app = express();

// this will only handle get call 
app.get("/user",(req, res) => {
    res.send({ firstname: "Madhawan", lastname: "Arya"});
});

app.post("/user",(req, res) => {
    res.send("data succesfully saved to database");
});

app.delete("/user",(req, res) => {
    res.send("Deleted succesfully");
});

// This will match all http method API calls 

app.use("/test",(req, res) => {
    res.send("Hello from the server!");
});

app.listen(7777, () =>{
    console.log('Server is succesfully connected to port 7777');

});