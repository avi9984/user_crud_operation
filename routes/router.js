const express = require("express");
const multer = require("multer");
const router = express.Router();
const User = require("../controller/userController");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "../uploads");
//   },
//   filename:(req,file,cb)=>{
//     cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname)
//   }
// });
// const upload=multer({storage:storage}).single('image')
router.post("/register", User.createUser);
router.post("/login", User.userLogin);
router.get("/user/:userId", User.getUserDetailsById);
router.put("/user/:userId", User.updateUser);
router.get("/user/AllUsers", User.getAllUsers);
router.delete("/user/delete/:userId", User.deleteUser)
module.exports = router;
