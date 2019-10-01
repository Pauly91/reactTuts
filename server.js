const express = require("express");
const connectDB = require("./config/db");
const app = express();

// Connect DataBase
connectDB();
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => res.send("API is running"));

// Init Middleware,
// More about middleware can be read here:
// https://medium.com/@selvaganesh93/how-node-js-middleware-works-d8e02a936113

app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

app.listen(PORT, () => console.log(`Server is started on port ${PORT}`));
// This starts a server on the said port and listens to any calls.

/*
Notes:
- This is the main entry file. This is also the place where all the routing DB connections
 and other meta level settings are configured.
- Express the web frame work for node, providing a standard way of deploying a server or a 
web application.
  
*/

/*


Notes on package.json:
- This file can be created with the npm init command.
- package.json is node.js file, that is the meta data for the project.
- dependencies: The third party package or modules installed using npm are specified in this segment.
- devDependencies: The dependencies that are used only in the development part of the application are 
specified in this segment. These dependencies do not get rolled out when the application is in production 
stage.
- npm i packagename to install modules.
- npm i -D for dev dependency.
- main property is the main entry file - the first file that the control lands when accessing the page.

*/
