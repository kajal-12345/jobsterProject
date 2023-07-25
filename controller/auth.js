const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((us) => {
      if (us) {
        //    console.log("user already exist");
        return res.status(400).json({ message: "user already exist" });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name: name,
          email: email,
          password: hashedPassword,
          jobs: [],
        });

        user
          .save()
          .then((createduser) => {
            return res
              .status(200)
              .json({ message: "user created", user: createduser });
          })
          .catch((err) => {
            throw err;
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
const postSignin = (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then(async (domatch) => {
            if (domatch) {
              // req.session.isLoggedIn = true;
              // req.session.text = "true";
              // req.session.user = user;

              //   return req.session.save((err) => {
              //     if (err) console.log(err);
              //    res.status(200).json({
              //       message: "login succesful",
              //       user: req.session.user,
              //       isAuthenticated: req.session.isLoggedIn,
              //     });
              //   });
              const token = jwt.sign({ id: user._id }, "secretKey", {
                expiresIn: "24h", // expires in 24 hours
              });
              res.status(200).json({
                message: "login succesful",
                user: user,
                token: token,
              });
            }else{
              res.status(401).json({ message: "unauthorized user" });
            }

             
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
const updateUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then(async (user) => {
      if (!user) {
        const error = new Error("user not found");
        error.statusCode = 401;
        throw error;
      }
      user.name = req.body.name;
      user.email = req.body.email;
      user.lastName = req.body.lastName;
      user.location = req.body.location;
      const updatedUser = await user.save();
      // console.log(updatedUser);
      return res
        .status(200)
        .json({ message: "updated user", user: updatedUser });
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = {
  postSignup,
  postSignin,
  updateUser,
};
