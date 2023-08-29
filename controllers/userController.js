const { User } = require("../models"); //const User = require('./models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

class UserController {
  static async getAllUser(req, res) {
    try {
      const data = await User.findAll()
      if(data){
        res.status(200).json({message: 'Found Users', data: data})
      }else{
        res.status(404).json({message: "Not Found"})
      }
    } catch (error) {
      console.log(error)
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      const findOneUser = await User.findOne({
        where: { username },
      });
      if (findOneUser) {
        const comparePass = await bcrypt.compare(
          password,
          findOneUser.password
        );
        if (comparePass) {
          const token = jwt.sign(
            {
              id: findOneUser.id,
              username: findOneUser.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );
          res.status(201).json({
            message: "login succes",
            id: findOneUser.id,
            username: findOneUser.username,
            token,
          });
        } else {
          res.status(404).json({ message: "Wrong Password" });
        }
      } else {
        res.status(404).json({ message: "Username Not Found" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async register(req, res) {
    const registrationSchema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string()
        .min(6)
        .required()
        .pattern(new RegExp("^(?=.*[A-Z])(?=.*[0-9])")) // Minimal satu huruf besar dan satu angka
        .message(
          "Password must contain at least one uppercase letter and one digit"
        ),
    });
    try {
      const { error } = registrationSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          message: "Validation error",
          error: error.message,
        });
      }

      const { username, password } = req.body;

      const findOneUser = await User.findOne({
        where: { username },
      });

      if (findOneUser) {
        return res.status(401).json({
          message: "Username already exists",
        });
      }

      bcrypt.hash(password, 10, async function (err, hash) {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          const response = await User.create({
            username,
            password: hash,
          });
          res.status(201).json({
            message: "Creating user success",
            response,
          });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}

module.exports = UserController;
