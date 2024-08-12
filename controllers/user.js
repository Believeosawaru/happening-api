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

        group.members.push(createdBy);

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
        const id = String(req.params.groupId);

        const currentUserId = req.user._id;

        const groupId = new ObjectId(id);

        const group = await Group.findOne({_id: groupId});

        const ownerId = group.createdBy;
        const owner = new ObjectId(ownerId);

        const { firstName, lastName, _id } = await User.findOne({_id: owner})

        res.status(200).json({
            code: 200,
             status: true,
             data: group,
             currentUserId,
             createdBy: {
                firstName,
                lastName,
                _id
             }
        });
    } catch (error) {
        next(error);
    }
}

const editGroupInfo = async (req, res, next) => {
    try {
        const { name, description, location, groupType } = req.body;

        const id = String(req.params.groupId);

        const groupId = new ObjectId(id);

        const group = await Group.findOne({_id: groupId});

        group.name = name;
        group.description = description;
        group.location = location;
        group.groupType = groupType;

        await group.save();

        res.status(200).json({
            code: 200,
            status: true,
            message: "Group Edited Successfully"
        });
    } catch (error) {
        next(error);
    }
}

const showGroupInfo = async (req, res, next) => {
    try {
        const id = String(req.params.groupId);

        const groupId = new ObjectId(id);

        const group = await Group.findOne({_id: groupId});

        res.status(200).json({
             code: 200,
             status: true,
             data: group,
        });
    } catch (error) {
        next(error);
    }
}

const deleteGroup = async (req, res, next) => {
    try {
        const id = String(req.params.groupId);

        const groupId = new ObjectId(id);

        await Group.findByIdAndDelete(groupId);
        await User.updateMany({ groups: groupId }, { $pull: { groups: groupId } })

        res.status(200).json({
            code: 200,
            status: true,
            message: "Group Deleted Successfully"
        })
    } catch (error) {
        next(error);
    }
}

const searchUsers = async (req, res, next) => {
    try {
        const { query } = req.query;

        if (!query) {
            res.code = 400;
            throw new Error("No Search Query Provided");
        }

        const users = await User.find({
            $or: [{firstName: {$regex: query, $options: "i"}}, {lastName: {$regex: query, $options: "i"}},
            {email: {$regex: query, $options: "i"}}
            ]
        }).select("firstName lastName email")

        res.status(200).json({
            code: 200,
            status: true,
            message: users
        })
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

export { homeController, groupController, eventController, displayGroupController, groupInfo, editGroupInfo, showGroupInfo, deleteGroup, searchUsers }