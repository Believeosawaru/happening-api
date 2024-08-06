import { check } from "express-validator"

const signUpValidator = [
    check("firstName").notEmpty().withMessage("First Name Is Required"),

    check("lastName").notEmpty().withMessage("Last Name Is Required"),

    check("email").notEmpty().withMessage("Email Is Required").isEmail().withMessage("Email Must Be Valid Email"),

    check("password").isLength({min: 6}).withMessage("Password Should Be 6 Characters Or More Characters Long").notEmpty().withMessage("Password Is Required")
]

const signInValidator = [
    check("email").notEmpty().withMessage("Email Is Required").isEmail().withMessage("Email Must Be Valid Email"),

    check("password").notEmpty().withMessage("Password Is Required")
]

const emailValidator = [
    check("email").notEmpty().withMessage("Email Is Required").isEmail().withMessage("Email Must Be Valid Email"),
]

const verifyUserValidator = [
    check("email").notEmpty().withMessage("Email Is Required").isEmail().withMessage("Email Must Be Valid Email"),

    check("code").notEmpty().withMessage("Code Is Required, Check Your Email")
]

const recoverPasswordValidator = [
    check("email").notEmpty().withMessage("Email Is Required").isEmail().withMessage("Email Must Be Valid Email"),

    check("code").notEmpty().withMessage("Code Is Required, Check Your Email"),

    check("password").isLength({min: 6}).withMessage("Password Should Be 6 Characters Or More Characters Long").notEmpty().withMessage("Password Is Required")
]

const changePasswordValidator = [
    check("oldPassword").notEmpty().withMessage("Old Password Is Required"),

    check("newPassword").notEmpty().withMessage("New Password Is Required").isLength({min: 6}).withMessage("Password Should Be 6 Characters Or More Characters Long")
]

export {signUpValidator, signInValidator, emailValidator, verifyUserValidator, recoverPasswordValidator, changePasswordValidator }