const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const {
  isValid,
  isValidBody,
  validString,
  validEmail,
  validPwd,
  validGender,
} = require("../utils/validation");

//  Post/Register

//   const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "../uploads");
//   },
//   filename:(req,file,cb)=>{
//     cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname)
//   }
// });
// const upload=multer({storage:storage}).single('image')
const createUser = async (req, res) => {
  try {
    let data = req.body;
    const { name, gender, email, password, cnfPassword, address, image } = data;
    //Validate the Body

    if (isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter user details" });
    }

    if (!gender) {
      return res
        .status(400)
        .send({ status: false, message: "Gender is required" });
    }

    if (!name) {
      return res
        .status(400)
        .send({ status: false, message: "Name is required" });
    }
    // if (!image) {
    //   return res.status(400).send({ status: false, message: "image is required" });
    // }

    //check the email

    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "Email ID is required" });
    }

    //check the password

    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    }
    if (!cnfPassword) {
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    }

    if (!address) {
      return res
        .status(400)
        .send({ status: false, message: "address is required" });
    }

    if (validGender(gender)) {
      return res.status(400).send({
        status: false,
        message: "Gender should be one of Male, Female or LGBT",
      });
    }

    //Validate  the name

    if (validString(name)) {
      return res.status(400).send({
        status: false,
        message: "Name should be valid and should not contains any numbers",
      });
    }

    //Validate the email

    if (validEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid email-id" });
    }

    //Validate the password

    if (validPwd(password)) {
      return res.status(400).send({
        status: false,
        message:
          "Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters",
      });
    }

    if (validPwd(cnfPassword)) {
      return res.status(400).send({
        status: false,
        message:
          "Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters",
      });
    }

    // Checking duplicate Entry Of User email
    let duplicateEmail = await User.findOne({ email: email });

    if (duplicateEmail) {
      return res
        .status(400)
        .send({ status: false, message: "User email-Id already exists" });
    }

    //Password Encryption

    // if(data.password && data.cnfPassword==data.password)
    //   data.password = await bcrypt.hash(data.cnfPassword, 10);
    if (password !== cnfPassword) {
      res
        .status(400)
        .send({
          status: false,
          message: "Password & Conform Password Does not match",
        });
    } else {
      data.password = await bcrypt.hash(data.password, 10);
    }

    let userData = await User.create(data);

    res.status(201).send({
      status: true,
      message: "User created successfully",
      data: userData,
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//    Post/login  //

// const createUser=async (req,res)=>{
//   try {
//     const data=req.body;
//     const {name,email,password,address,gender}=data
//     let cnfPassword;
//     if(password==cnfPassword){
//       password = await bcrypt.hash(cnfPassword, 10)
//     }
//     let
//   } catch (error) {
//     console.log(error)
//     res.status(500).send({ status: false, message: err.message })
//   }
// }

const userLogin = async function (req, res) {
  try {
    let data = req.body;

    //Validate the body

    if (isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter user details" });
    }

    //Check the email

    if (!data.email) {
      return res
        .status(400)
        .send({ status: false, message: "Email ID is required" });
    }

    //check the password

    if (!data.password) {
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    }

    //Validate the email

    if (validEmail(data.email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid email-id" });
    }

    //Validate the password

    if (validPwd(data.password)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid password" });
    }

    //Email check

    const checkValidUser = await User.findOne({ email: data.email });

    if (!checkValidUser) {
      return res
        .status(404)
        .send({ status: false, message: "Email not found " });
    }

    //Password check

    let checkPassword = await bcrypt.compare(
      data.password,
      checkValidUser.password
    );

    if (!checkPassword) {
      return res
        .status(400)
        .send({ status: false, message: "Password is not correct" });
    }

    // token generation for the logged in user

    let token = jwt.sign({ userId: checkValidUser._id }, "crud", {
      expiresIn: "1d",
    });

    //set token to the header

    res.setHeader("x-api-key", token);

    res
      .status(200)
      .send({ status: true, message: "Successfully Login", data: token });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const getUserDetailsById = async function (req, res) {
  const userId = req.params.userId;
  if (!isValid(userId)) {
    return res
      .status(400)
      .send({ status: false, message: "userId is not given" });
  }
  if (!mongoose.isValidObjectId(userId)) {
    return res
      .status(400)
      .send({ status: false, message: "userId is Invalid" });
  }

  const findUserId = await User.findById(userId);
  if (!findUserId)
    return res.status(403).send({ status: false, message: "NO DATA FOUND" });

  return res
    .status(200)
    .send({ status: true, message: "user profile details", data: findUserId });
};

const updateUser = async (req, res) => {
  try {
    let data = req.body;
    let userId = req.params.userId;
    let files = req.files;

    if (!isValid(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "userId is not given" });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "userId is Invalid" });
    }

    const findUserId = await User.findById(userId);
    if (!findUserId)
      return res.status(403).send({ status: false, message: "NO DATA FOUND" });

    // check request body is valid
    if (isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, msg: "Enter a valid details" });
    }
    let { name, email, password, gender, address, cnfPassword } = data;
    let updateData = {};

    if (name) {
      if (!isValid(name)) {
        return res
          .status(400)
          .send({ status: false, message: "name is missing." });
      }
      if (validString(name)) {
        return res
          .status(400)
          .send({ status: false, message: "shuld be string." });
      }
      updateData.name = name;
    }

    if (gender) {
      if (!isValid(name)) {
        return res
          .status(400)
          .send({ status: false, message: "name is missing." });
      }
      if (!validString(name)) {
        return res
          .status(400)
          .send({ status: false, message: "shuld be string." });
      }
      updateData.name = name;
    }
    if (address) {
      if (!isValid(address)) {
        return res
          .status(400)
          .send({ status: false, message: "name is missing." });
      }

      updateData.address = address;
    }
    if (email) {
      if (!isValid(email)) {
        return res
          .status(400)
          .send({ status: false, msg: "Enter a valid email id" });
      }
      email = email.toLowerCase();
      if (validEmail(email)) {
        return res
          .status(400)
          .send({ status: false, message: "EMAIL is invalid" });
      }

      let checkEmail = await User.findOne({ email: data.email });
      if (checkEmail)
        return res
          .status(400)
          .send({ status: false, message: "Email already exist" });

      updateData.email = email;
    }
    if (password) {
      if (!validPwd(password)) {
        return res
          .status(400)
          .send({
            status: false,
            msg: "Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters",
          });
      }
      if (!validPwd(cnfPassword)) {
        return res
          .status(400)
          .send({
            status: false,
            msg: "Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters",
          });
      }
      if (password !== cnfPassword) {
        res
          .status(400)
          .send({
            status: false,
            message: "Password & Conform Password Does not match",
          });
      } else {
        data.password = await bcrypt.hash(data.password, 10);
      }
      // data.password = await bcrypt.hash(data.password, 10);
    }
    const updateUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    res
      .status(200)
      .send({ status: true, msg: "User profile updated", data: updateUser });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUser = await User.find();

    if (!allUser) {
      return res.status(400).send({ status: false, msg: "there is no user" });
    }
    return res
      .status(200)
      .send({ status: true, msg: "All users", data: allUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, msg: "internal sever error" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ status: false, msg: "invalid id " });
    }
    let result = await User.findByIdAndDelete(userId);
    if (!result) {
      return res
        .status(404)
        .json({ status: false, msg: "already deleted or not in db" });
    }
    return res
      .status(200)
      .json({ status: true, msg: "user deleted successfully", data: result });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, msg: "internal server error" });
  }
};
module.exports = {
  createUser,
  userLogin,
  getUserDetailsById,
  updateUser,
  getAllUsers,
  deleteUser,
};
