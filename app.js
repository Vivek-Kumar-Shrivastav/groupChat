const express = require("express");
const app = express();
require("dotenv").config();


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

const sequelize = require("./db/connect");
const cors = require("cors");
const User = require("./models/users");
const chats = require("./models/chats");
const Group = require("./models/group");

app.use(express.json());
app.use(cors({ origin: process.env.ORIGIN_IP }));

User.hasMany(chats);
chats.belongsTo(User);

Group.belongsToMany(User, { through: "UserGroups" });
User.belongsToMany(Group, { through: "UserGroups" });

Group.hasMany(chats);
chats.belongsTo(Group);

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "public", "signup", "signup.html"));
});
app.get("/login", (req, res) => {
   res.sendFile(path.join(__dirname, "public", "login", "login.html"));
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
