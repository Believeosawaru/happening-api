import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { Event, Group } from "../models/index.js";
import { User } from "../models/index.js";

const homeController = async (req, res, next) => {
    try {
        const userName = req.user.firstName;
        const email = req.user.email;

        const user = await User.findOne({email})

        if (!user) {
            res.status(404).json({
                code: 404,
                status: false,
                message: "Not Found"
            })
        }

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

        const creator = await User.findById(createdBy);
        creator.groups.push(group._id);

        await creator.save();
        await group.save();

        res.status(201).json({
            code: 201,
            status: true,
            message: "Group Created Successfully"
        });
    } catch (error) {
        next(error)
    }
}

const displayGroupController = async (req, res, next) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).populate("groups");

        if (!user) {
            res.status(400).json({
                code: 400,
                status: false,
                message: "User Not Found"
            })
        }

        res.status(200).json({
            code: 200,
            status: true,
            message: user.groups
        });
    } catch (error) {
        next(error)
    }
}

const groupInfo = async (req, res, next) => {
    try {
        const name = String(req.params.groupId);

        const group = await Group.findOne({name});

        res.status(200).json({
            code: 200,
             status: true,
             message: group
        });
    } catch (error) {
        next(error);
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

export { homeController, groupController, eventController, displayGroupController, groupInfo }