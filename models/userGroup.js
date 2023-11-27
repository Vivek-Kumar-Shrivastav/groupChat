const {DataTypes} = require('sequelize');
const sequelize = require('../db/connect');

const UserGroup = sequelize.define('UserGroups',{
    id:{
        type:DataTypes.INTEGER,
        unique:true,
        autoIncrement:true,
        primaryKey:true

    },

})

module.exports = UserGroup