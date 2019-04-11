import express from "express";
import User from "../models/User";
import parseErrors from "../controllers/parseErrors";
import multer from "multer";
import uuid from "uuid";
import sharp from "sharp";

import {
  sendConfirmationEmail,
  sendDeleteUserEmail,
  sendRejectEmail
} from "../controllers/mailer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function(req, file, cb) {
    req["imageFileName"] =
      Date.now() + uuid() + file.originalname.match(/\.\w+$/);
    cb(null, req.imageFileName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limit: {
    fileSite: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

//Update Image
router.post("/users/update-img/:id", upload.single("userImage"), (req, res) => {
  sharp("./public/uploads/" + req.imageFileName)
    .resize(320)
    .toFile(`./public/uploads/${req.imageFileName}`, (err, info) =>
      console.log("newImage", info)
    );
  const newImage = `http://localhost:8080/uploads/${req.imageFileName}`;
  console.log("newImage", newImage);
  User.findByIdAndUpdate(
    req.body.id,
    { userImage: newImage },
    {
      new: true,
      select:
        "_id location availability createdAt email firstName lastName studentClass linkedInLink xingLink githubLink portfolioLink userImage confirmationEmailSend confirmed isAdmin"
    }
  ).then(updatedImg => {
    console.log("user router back", updatedImg);
    res.json(updatedImg);
  });
});

//Update user profile
router.put("/users/update-user/:id", (req, res) => {
  //console.log("REQ.BODY", req.body);
  User.findByIdAndUpdate(req.params.id, req.body.user, {
    new: true,
    passwordHash: 0,
    isAdmin: 0,
    confirmationToken: 0,
    confirmed: 0,
    confirmationEmailSend: 0
  })
    .then(updatedUser => {
      //console.log("user router back", updatedUser);
      res.json(updatedUser);
    })
    .catch(error =>
      res.json({
        success: false,
        message: error
      })
    );
});

//REGISTRATION
router.post("/users/registration", (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    location,
    studentClass
  } = req.body.user;
  const user = new User({
    email,
    firstName,
    lastName,
    location,
    studentClass
  });
  user.setPassword(password);
  user.setConfirmationToken();
  user
    .save()
    .then(user => {
      //sendConfirmationEmail(user);
      res.json({ user: user.toAuthJSON() });
    })
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

//Approve user by admin
router.post("/users/waiting-users/:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      sendConfirmationEmail(user);
      updateConfirmationEmailStatus(user);
      res.json({
        success: true
      });
    })
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

//Reject waiting user by admin
router.delete("/users/delete-users/:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      user.remove().then(user => {
        if (user.confirmed) {
          sendDeleteUserEmail(user);
        } else {
          sendRejectEmail(user);
        }
        res.json({
          success: true
        });
      });
    })
    .catch(error =>
      res.json({
        success: false,
        message: "User is not exists"
      })
    );
});

//Change status of user when admin approved request
const updateConfirmationEmailStatus = user => {
  User.findByIdAndUpdate(
    user._id,
    { confirmationEmailSend: true },
    { new: true }
  ).then(updatedUser => {
    console.log("updateConfirmationEmailStatus(user)", updatedUser);
  });
};

//Get All Approved Users
router.get("/users", (req, res) => {
  User.find(
    {
      //confirmed: { $in: ["true", true] },
      isAdmin: { $in: ["false", false] }
    },
    { passwordHash: 0 }
  ).then(user => {
    res.json(user);
  });
});

//Get One User
router.post("/users/dashboard", (req, res) => {
  User.findOne(
    { email: req.body.email },
    {
      passwordHash: 0,
      isAdmin: 0,
      confirmationToken: 0,
      confirmed: 0,
      confirmationEmailSend: 0
    }
  )
    .then(user => {
      // console.log("//Get One User", user);
      res.json(user);
    })
    .catch(error =>
      res.json({
        success: false,
        message: "User is not exists"
      })
    );
});

export default router;
