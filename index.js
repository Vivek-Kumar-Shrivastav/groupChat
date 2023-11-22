const express = require("express");
const app = express();
require("dotenv").config();

// WebSocket is a communication protocol that provides full-duplex communication channels over a single TCP connection, allowing for real-time data transfer between the server and clients.

const http = require("http").Server(app);
const io = require("socket.io")(http);

// new socket connection is established
io.on("connection", (socket) => {
   // Listen for the 'chat message' event
   socket.on("message", (msg, userName, groupId) => {
      // Broadcast the message to all connected clients
      io.emit("message", msg, userName, groupId);
   });

   socket.on("file", (msg, userName, groupId) => {
      io.emit("file", msg, userName, groupId);
   });
});

const userRoute = require("./routes/users");
const chatsRoute = require("./routes/chats");
const groupRoute = require("./routes/groups");
const path = require("path");

// Sequelize is an Object-Relational Mapping (ORM) library for Node.js, and it allows you to interact with databases using JavaScript objects.

const sequelize = require("./db/connect");
const cors = require("cors");
const User = require("./models/users");
const chats = require("./models/chats");
const Group = require("./models/group");

app.use(express.json());
app.use(cors({ origin: process.env.ORIGIN_IP }));

// Establish a one-to-many relationship between the User and chats models, where a user can have many chats, and each chat belongs to one user.
User.hasMany(chats);
chats.belongsTo(User);

// Establish a many-to-many relationship between the Group and User models using an intermediary table named "UserGroups."
// When you use belongsToMany in Sequelize, it automatically creates foreign key constraints for you.Sequelize will create two foreign key columns in the UserGroups table: GroupId and UserId. These columns will reference the primary keys of the Group and User tables, respectively.

Group.belongsToMany(User, { through: "UserGroups" });
User.belongsToMany(Group, { through: "UserGroups" });

// Establish a one-to-many relationship between the Group and chats models, where a group can have many chats, and each chat belongs to one group.
Group.hasMany(chats);
chats.belongsTo(Group);


app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "public", "signup", "signup.html"));
});
app.get("/login", (req, res) => {
   res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/whatsup", (req, res) => {
   res.sendFile(path.join(__dirname, "public", "homepage", "home.html"));
});

app.use("/users", userRoute);
app.use(chatsRoute);
app.use("/groups", groupRoute);

Group.findOrCreate({ where: { groupName: process.env.GRP } })
   .then(([group, created]) => {
      if (created) {
         console.log("group created");
      } else {
         console.log("group already exists");
      }
   })
   .catch((err) => console.log(err));

(async () => {
   try {
      await sequelize.sync();
      await Group.findOrCreate({ where: { groupName: process.env.GRP } });

      http.listen(3002, () => {
         console.log(`server listening on port 3002`);
      });
   } catch (error) {
      console.log(error);
   }
})();
