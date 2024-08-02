import User from "../models/User.js";
import hashPassword from "../utils/hashPassword.js";
import comparePassword from "../utils/comparePassword.js";
import generateToken from "../utils/generateToken.js";
import generateCode from "../utils/generateCode.js";

const signUpController = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const isEmailExist = await User.findOne({email});

        if (isEmailExist){
            res.code = 400;
            res.status.json(
                {
                    code: 400,
                    status: false,
                    message: "Email Is Already In Use"
                }
            );
        }

        const hashedPassword = await hashPassword(password);

        const user = new User({firstName, lastName, email, password: hashedPassword});

        await user.save();
        
        res.status(201).json({
            code: 201,
            status: true,
            message: "User Created Successfully"
        });
    } catch (error) {
        next(error);
    }
}

const signInController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email});

        if (!user) {
            res.code = 401;
            throw new Error("Invalid Credentials");
        }

        const match = await comparePassword(password, user.password);

        if (!match) {
            res.code = 401;
            throw new Error("Invalid Credentials");
        }

        const token = generateToken(user);

        res.status(200).json({
            code: 200,
            status: true,
            message: "User Logged In Successfully",
            data: token
        })
    } catch (error) {
        next(error);
    }
}

const verifyCode = async (req, res, next) => {
    try {
        const {email} = req.body;

        const user = await User.findOne({email});

        if (!user) {
            res.code = 404;
            throw new Error("User Not Found")
        }

        if (user.isVerified) {
            res.code = 400;
            throw new Error("User Is Already Verified");
        }

        const code = generateCode(6);

        user.verificationCode = code;
        await user.save();

        // send email

        res.status(200).json({
            code: 200,
            status: true,
            message: "Verification Code Sent Successfully"
        })
    } catch (error) {
        next(error)
    }
}

export {signUpController, signInController, verifyCode};