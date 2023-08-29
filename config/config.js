require('dotenv').config()

const config = {
    development: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: "db_image_sharing_app",
      host: "localhost",
      dialect: "postgres",
    },
  };
  

  module.exports = config;