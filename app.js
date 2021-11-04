const express = require("express");
const app = express();
const port = 4157;

// We want to use JSON to send post request to our application
app.use(express.json());

// We tell express to serve the folder public as static content
app.use(express.static("public"));

app.get("/public");

app.listen(port, () => console.log(`Listening on port ${port}!`));
