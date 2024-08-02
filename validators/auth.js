import { check } from "express-validator"

const signUpValidator = [
    check("firstName").notEmpty().withMessage("First Name Is Required"),

    check("lastName").notEmpty().withMessage("Last Name Is Required"),

    check("email").notEmpty().withMessage("Email Is Required").isEmail().withMessage("Email Must Be Valid Email"),

    check("password").isLength({min: 6}).withMessage("Password Should Be 6 Characters Or More Characters Long").notEmpty().withMessage("First Name Is Required")
]

const signInValidator = [
    check("email").notEmpty().withMessage("Email Is Required").isEmail().withMessage("Email Must Be Valid Email"),

    check("password").notEmpty().withMessage("Password Is Required")
]

const emailValidator = [
    check("email").notEmpty().withMessage("Email Is Required").isEmail().withMessage("Email Must Be Valid Email"),
]

export {signUpValidator, signInValidator, emailValidator}