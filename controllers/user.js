import { Event, Group } from "../models/index.js";
import { User } from "../models/index.js";

const homeController = async (req, res, next) => {
    try {
        const userName = req.user.firstName;
        const email = req.user.email;

        const user = await User.findOne({email})

        if (user.isVerified === false) {
            res.status(403).json({
                code: 403,
                status: false,
                message: `${userName}`
            })
        } else {
            res.status(200).json({
                code: 200,
                status: true,
                message: `${userName}`
            });
        }
    } catch (error) {
        next(error);
    }
} 

const groupController = async (req, res, next) => {
    const { name, description, location, groupType } = req.body;
    const createdBy = req.user._id;

    try {
        const group = new Group({
            name, 
            description,
            location,
            groupType,
            createdBy
        });

        await group.save();

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