const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth");
const { createNewGroup, getAllGroups, addMembers2Group, kickMembers2Group, changeAdmin,deleteGroup } = require("../controllers/groups");

router.route("/").post(authorization, createNewGroup).get(authorization, getAllGroups);
router.route("/addmembers").post(authorization, addMembers2Group);
router.route("/kickmembers").post(authorization, kickMembers2Group);
router.route("/promoteAdmin").patch(authorization, changeAdmin);
router.route("/deleteGroup/:id").delete(authorization, deleteGroup);
module.exports = router;
