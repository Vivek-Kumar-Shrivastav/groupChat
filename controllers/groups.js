const Group = require("../models/group");
const User = require("../models/user");
const UserGroups = require("../models/userGroup");
const Chat = require("../models/chats");

async function createNewGroup(req, res, next) {
   try {
      let result = await Group.create({
         groupName: req.body.groupName,
         createdBy: req.body.userId,
      });
      await UserGroups.create({ groupId: result.id, userId: req.body.userId });
      res.status(201).json({ msg: "group created" });
   } catch (error) {
      console.log(error);
      res.status(401).json({ msg: "cannot create group", err: error });
   }
}
async function getAllGroups(req, res, next) {
   try {
      let user = await User.findOne({ where: { id: req.body.userId } });
      let groups = await user.getGroups();
      // const groups = await Group.findAll({
      // 	include: [
      // 	  {
      // 		model: User,
      // 		through: UserGroup, // Assuming there's a join table named UserGroup
      // 		where: { id: userId },
      // 	  },
      // 	],
      //   });
      res.status(201).json(groups);
   } catch (error) {
      console.log(error);
      res.status(404).json({ msg: "cannot get groups", err: error });
   }
}
async function addMembers2Group(req, res, next) {
   try {
      let member = await User.findOne({
         where: { phoneNo: req.body.memberPh },
      });
      let group = await Group.findOne({ where: { id: req.body.groupid } });
      if (!member) {
         return res.status(404).json({ msg: "no user with this phone no" });
      }

      let memberId = member.id;
      const isMember = await member.hasGroups(group);
      if (isMember) {
         return res
            .status(404)
            .json({ msg: "user is already presesnt in group" });
      }
      await UserGroups.create({ groupId: req.body.groupid, userId: memberId });
      res.status(201).json({ msg: "member added" });
   } catch (error) {
      console.log(error);
      res.status(404).json({
         msg: "some error occured ,please try again",
         err: error,
      });
   }
}
async function kickMembers2Group(req, res, next) {
   try {
      let member = await User.findOne({
         where: { phoneNo: req.body.memberPh },
      });
      let group = await Group.findOne({ where: { id: req.body.groupid } });
      if (!member) {
         return res.status(404).json({ msg: "no user with this phone number" });
      }
      let memberId = member.id;
      const isMember = await member.hasGroups(group);
      if (!isMember) {
         return res
            .status(404)
            .json({ msg: "user isnt a member of this group" });
      }
      await UserGroups.destroy({
         where: { groupId: req.body.groupid, userId: memberId },
      });
      res.status(201).json({ msg: "member kicked out" });
   } catch (error) {
      console.log(error);
      res.status(400).json({ msg: "some error occured while kicking out" });
   }
}
async function changeAdmin(req, res, next) {
   try {
      let member = await User.findOne({
         where: { phoneNo: req.body.memberPh },
      });
      let group = await Group.findOne({ where: { id: req.body.groupid } });
      if (!member) {
         return res.status(404).json({ msg: "no user with this phone no" });
      }
      let memberId = member.id;
      const isMember = await member.hasGroups(group);
      if (!isMember) {
         return res
            .status(404)
            .json({ msg: "before making him admin add him to the group" });
      }
      await Group.update(
         { createdBy: memberId },
         { where: { id: req.body.groupid } }
      );
      res.status(201).json({ msg: "you are no longer an admin" });
   } catch (error) {
      console.log(error);
      res.status(400).json({
         msg: "some error occured, please try again",
         err: error,
      });
   }
}
async function deleteGroup(req, res, next) {
   try {
      const { id } = req.params;
      await Group.destroy({
         where: { id: id },
      });

      await UserGroups.destroy({
         where: { groupId: id },
      });

      await Chat.destroy({
         where: { groupId: id },
      });
      res.status(201).json({ msg: "the group was successfully deleted" });
   } catch (error) {
      console.log(error);
      res.status(400).json({
         msg: "some error occured, please try again",
         err: error,
      });
   }
}
module.exports = {
   createNewGroup,
   getAllGroups,
   addMembers2Group,
   kickMembers2Group,
   changeAdmin,
   deleteGroup,
};
