// import sendEmail from "../utils/sendEmail.js";
import { Event, Group } from "../models/index.js";
import User from "../models/index.js";
// import generateCode from "../utils/generateCode.js";

const homeController = async (req, res, next) => {
    try {
        const userName = req.user.firstName;
        const email = req.user.email;

        const user = await User.findOne({email})

        if (user.isVerified === false) {
            return res.status(403).json({
                code: 403,
                status: false,
                message: "User Not Verified",
                redirectUrl: "/verify-account.html"
            });
        }

        res.status(200).json({
            code: 200,
            status: true,
            message: `${userName}`
        });
    } catch (error) {
        next(error);
    }
} 

const groupController = async (req, res, next) => {
    const { name, description, userId } = req.body;

    try {
        const group = new Group({
            name, 
            description,
            members: [userId]
        });

        await group.save();

        await userId.findByIdAndUpdate(userId, { $push: { groups: group._id} });

        res.status(201).json({
            code: 201,
            status: false,
            message: "Group Created Successfully"
        });
    } catch (error) {
        next(error)
    }
}

const eventController = async (req, res, next) => {
    try {
        const { name, description, date, groupId, userId } = req.body;

        const event = new Event({name, description, date, group: groupId, createdBy: userId});

        await event.save();

        await Group.findByIdAndUpdate(groupId, { $push: { events: event._id }});

        res.status(201).json(event);
    } catch (error) {
        next(error);
    }
}

export { homeController, groupController, eventController }