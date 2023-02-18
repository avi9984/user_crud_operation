const mongoose = require("mongoose");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidObjectType = (value) => {
  if (typeof value === "object" && Object.keys(value).length > 0) {
    return false;
  } else {
    return true;
  }
};

const isValidBody = (object) => {
  if (Object.keys(object).length > 0) {
    return false;
  } else {
    return true;
  }
};

const validGender = (Gender) => {
  let correctTitle = ["Male", "Female", "LGBT"];
  if (correctTitle.includes(Gender)) {
    return false;
  } else {
    return true;
  }
};

const validString = (String) => {
  if (/\d/.test(String)) {
    return true;
  } else {
    return false;
  }
};


const validEmail = (Email) => {
  if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(Email)) {
    return false;
  } else {
    return true;
  }
};

const validPwd = (Password) => {
  if (
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(
      Password
    )
  ) {
    return false;
  } else {
    return true;
  }
};


module.exports = {
  isValid,
  isValidObjectType,
  isValidBody,
  validString,
  validEmail,
  validPwd,
  validGender
};
