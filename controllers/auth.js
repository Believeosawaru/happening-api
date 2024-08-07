import User from "../models/User.js";
import hashPassword from "../utils/hashPassword.js";
import comparePassword from "../utils/comparePassword.js";
import generateToken from "../utils/generateToken.js";
import generateCode from "../utils/generateCode.js";
import sendEmail from "../utils/sendEmail.js";

const signUpController = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const isEmailExist = await User.findOne({email});

        if (isEmailExist){
            res.code = 400;
            res.status(400).json(
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
            message: "User Signed Up Successfully"
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
            res.status(401).json({
                code: 401,
                status: false,
                message: "Invalid Credentials"
            });
        }

        const match = await comparePassword(password, user.password);

        if (!match) {
            res.status(401).json({
                code: 401,
                status: false,
                message: "Invalid Credentials"
            });
        }

        const token = generateToken(user);

        // if (user.isVerified !== null) {
        // // Verify Acccount

        // const code = generateCode(6);

        // user.verificationCode = code;
        // await user.save();

        // // await sendEmail({
        // //     from: "no-reply@happening.net",
        // //     emailTo: user.email,
        // //     subject: "Email Verification Code",
        // //     code,
        // //     content: "Verify Your Account"
        // // });
        // }

        console.log(token)

        res.status(200).json({
            code: 200,
            status: true,
            message: "User Logged In Successfully",
            token
        });
    } catch (error) {
        next(error);
    }
}

// const verifyCode = async (req, res, next) => {
//     try {
//         const email = req.user.email;

//         const user = await User.findOne({email});

//         if (!user) {
//             res.code = 404;
//             throw new Error("User Not Found")
//         }

//         if (user.isVerified) {
//             res.code = 400;
//             throw new Error("User Is Already Verified");
//         }

//         const code = generateCode(6);

//         user.verificationCode = code;
//         await user.save();

//         // send email
//         await sendEmail({
//             emailTo: user.email,
//             subject: "Email Verification Code",
//             code,
//             content: "Verify Your Account"
//         });

//         res.status(200).json({
//             code: 200,
//             status: true,
//             message: "Verification Code Sent Successfully"
//         })
//     } catch (error) {
//         next(error)
//     }
// }

const verifyUser = async (req, res, next) => {
    try {
        const email = req.user.email;
        const { code } = req.body;

        const user = await user.findOne({ email });

        if (!user) {
            res.code = 404;
            throw new Error("User Not Found");
        }

        if (user.verificationCode !== code) {
            res.code = 400;
            throw new Error("Verification Code Is Incorrect");
        }

        user.isVerified = true;
        user.verificationCode = null;

        await user.save();

        res.status(200).json({
            code: 200,
            status: true,
            message: "User Verified Successfully"
        });
    } catch (error) {
        next(error);
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.code = 404;
            throw new Error("User Not Found");
        }
        
        const code = generateCode(6);

        user.verificationCode = code;
        await user.save();

        await sendEmail({
            emailTo: user.email,
            subject: "Recover Your Account",
            code,
            content: "Change Your Password"
        });

        res.status(200).json({
            code: 200,
            status: true,
            message: "Code Sent Successfully"
        });
    } catch (error) {
        next(error);
    }
}

const recoverPassword = async (req, res, next) => {
    try {
        const { email, code, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.code = 400;
            throw new Error("User Not Found");
        }

        if (user.forgotPasswordCode !== code) {
            res.code = 400;
            throw new Error("Invalid Code");
        }

        const hashedPassword = await hashPassword(password);

        user.password = hashedPassword;
        user.forgotPasswordCode = null;

        await user.save();

        res.status(200).json({
            code: 200,
            status: true,
            message: "Password Recovered Successfully"
        })
    } catch (error) {
        next(error)
    }
}

const changePassword = async (req, res, next) => {
    try {
        const {oldPassword, newPassword} = req.body;
        const {_id} = req.user;

        const user = User.findById(_id);

        if (!user) {
            code = 404;
            throw new Error("User Not Found")
        }

        const match = await comparePassword(oldPassword, newPassword);

        if (!match) {
            code = 400;
            throw new Error("Old Password Is Incorrect");
        }

        if (oldPassword === newPassword) {
            code = 400;
            throw new Error("Old Password Cannot Be New Password")
        }

        const hashedPassword = await hashPassword(newPassword);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            code: 200,
            status: false,
            message: "Password Changed Successfully"
        })
    } catch (error) {
        next(error)
    }
}

export { signUpController, signInController, verifyUser, forgotPassword, recoverPassword, changePassword };