const Sequelize = require("sequelize");
const sequelize = new Sequelize(
   {
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      dialect: "mysql",
      host: "localhost",
      port : process.env.DB_PORT
   }
);

module.exports = sequelize;
