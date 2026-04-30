const { v2: cloudinary } = require("cloudinary");
const env = require("../config/env");

cloudinary.config(env.cloudinary);

module.exports = cloudinary;
