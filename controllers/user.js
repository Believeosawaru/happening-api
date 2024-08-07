import { Event, Group } from "../models/index.js";
import { User } from "../models/index.js";

const homeController = async (req, res, next) => {
    try {
        const userName = req.user.firstName;

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