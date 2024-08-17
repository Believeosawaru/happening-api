import { ObjectId } from "mongodb";
import { Event, Group } from "../models/index.js";
import { User } from "../models/index.js";
import InviteToken from "../models/inviteToken.js";
import generateInviteToken from "../utils/generateInviteLink.js"

const homeController = async (req, res, next) => {
    try {
        const userName = req.user.firstName;
        const email = req.user.email;

        const user = await User.findOne({email})

        if (!user) {
            res.status(404).json({
                code: 404,
                status: false,
                message: "User Not Found"
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

        const { firstName, lastName, _id } = await User.findOne({_id: owner});

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

        const id = String(req.params.groupId);

        const groupId = new ObjectId(id);

        const group = await Group.findById(groupId);

        if (!group) {
            res.code = 404;
            throw new Error("Group Not Found")
        }

        if (!query) {
            res.code = 400;
            throw new Error("No Name Provided");
        }

        const users = await User.find({
            _id: { $nin: [...group.members, group.createdBy] },
            isVerified: true,
            $or: [{firstName: {$regex: query, $options: "i"}}, {lastName: {$regex: query, $options: "i"}}
            ]
        }).select("firstName lastName email")

        if (!users) {
            res.code = 404;
            throw new Error("No User With That Name");
        }

        res.status(200).json({
            code: 200,
            status: true,
            users
        })
    } catch (error) {
        next(error);
    }
}

const addUser = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const id = String(req.params.groupId);
        const groupId = new ObjectId(id);

        const group = await Group.findById(groupId);

        if (!group) {
            res.code = 404;
            throw new Error("Group Not Found")
        }

        if (!group.members.includes(userId) || group.members.length < 1) {
            group.members.push(userId);

            await group.save();
        } else {
            res.status(400).json({
                code: 400,
                status: false,
                message: "Member Already Exists"
            })
        }

        await User.findByIdAndUpdate(userId, { $addToSet: { groups: group._id } });

        res.status(200).json({
            code: 200,
            status: true,
            message: "Member Added Successfully"
        })
    } catch (error) {
        next(error);
    }
}

const generateLink = async (req, res, next) => {
    try {
        const id = String(req.params.groupId);
        const groupId = new ObjectId(id);

        const group = await Group.findById(groupId);
        
        if (!group) {
            res.code = 404;
            throw new Error("Group Not Found")
        }

        const groupToken = generateInviteToken();
        
        const inviteToken = new InviteToken({ token: groupToken, groupId });

        await inviteToken.save();

        const inviteLink = `https://happening-khaki.vercel.app/html/groups/join-link.html?groupToken=${groupToken}/`

        res.status(201).json({
            code: 201,
            status: true,
            message: "Link Successfully Created",
            data: inviteLink
        })
    } catch (error) {
        next(error);
    }
}

const joinViaLink = async (req, res, next) => {
    try {
        const {groupToken} = req.params;

        const inviteToken = await InviteToken.findOne({ token: groupToken });

        const id = String(req.user._id);
        const userId = new ObjectId(id);

        const user = await User.findById(userId)

        const groupId = new ObjectId(String(inviteToken.groupId));

        const group = await Group.findById(groupId);

        if (!group) {
            res.code = 404;
            throw new Error("Group Not Found");
        }

        if (group.members.includes(req.user._id)) {
            res.code = 400;
            throw new Error("You Are Already A Group Member");
        }

        if (user.isVerified === false) {
            res.code = 400;
            throw new Error("You Are Not Verified");
        }

        group.members.push(req.user._id);
        user.groups.push(inviteToken.groupId);

        await group.save();
        await user.save();
        
        res.status(200).json({
            code: 200,
            status: true,
            message: "Group Joined Successfully"
        })
    } catch (error) {
        next(error);
    }
}

const joinGroup = async (req, res, next) => {
    try {
        const id = String(req.params.groupId);
        const groupId = new ObjectId(id);
        const uId = String(req.user._id);
        const userId = new ObjectId(uId);

        const group = await Group.findById(groupId);
        const user = await User.findById(userId);

        if (!group) {
            res.status(404).json({
                code: 404,
                status: false,
                message: "Group Not Found"
            })
        }

        if (user.isVerified === false) {
            res.status(401).json({
                code: 401,
                status: false,
                message: "User Is Not Verified"
            })
        }

        if (group.members.includes(uId)) {
            res.status(400).json({
                code: 400,
                status: false,
                message: "You Are Already A Member Of This Group"
            });
        }

        user.groups.push(groupId);
        group.members.push(uId);
        await group.save();
        await user.save();

        res.status(200).json({
            code: 200,
            status: true,
            message: "You've Joined This Group"
        });
    } catch (error) {
        next(error)
    }
}

const leaveGroup = async (req, res, next) => {
    try {
        const id = String(req.params.groupId);
        const groupId = new ObjectId(id);
        const uId = String(req.user._id);
        const userId = new ObjectId(uId);

        const group = await Group.findById(groupId);
        const user = await User.findById(userId);

        if (req.user._id === group.createdBy) {
            res.status(400).json({
                code: 400,
                status: false,
                message: "You're The Admin, You Can Only Delete This Group"
            })
        }

        const isMember = group.members.includes(req.user._id);

        if (!isMember) {
            res.status(400).json({
                code: 400,
                status: false,
                message: "You Are Not A Member Of This Group"
            });
        }

        group.members = group.members.filter(memberId => !memberId.equals(userId));

        user.groups = user.groups.filter(userGroupId => !userGroupId.equals(groupId));
        
        await group.save();
        await user.save();

        res.status(200).json({
            code: 200,
            status: true,
            message: "You've Left This Group"
        });
    } catch (error) {
        next(error)
    }
}

const latestGroup = async (req, res, next) => {
    try {
        const id = String(req.user._id);
        const userId = new ObjectId(id);

        const user = await User.findById(userId);

        if (!user) {
            res.code = 404;
            throw new Error("No User Found");
        }

        if (user.groups.length > 0) {
             const lastGroup = user.groups[user.groups.length - 1];
            
             const Gid = String(lastGroup);
             const groupId = new ObjectId(Gid);

             const group = await Group.findById(groupId)

             res.status(200).json({
                code: 200,
                status: true,
                message: group
             })
        } else {
            res.code = 404;
            throw new Error("You're Not In Any Groups");
        }
    } catch (error) {
        next(error)
    }
}

const allGroups = async (req, res, next) => {
    try {
        const id = String(req.user._id);
        const userId = new ObjectId(id);

        const publicGroups = await Group.find({ 
            groupType: "public",
            createdBy: { $ne: userId },
            members: { $ne: userId }
        });

        res.status(200).json({
            code: 200,
            status: true,
            message: publicGroups
        });
    } catch (error) {
        next(error)
    }
}

// End Of Groups Routes

// Start Of Events Routes

const eventController = async (req, res, next) => {
    try {
        const { name, description, time, location, type } = req.body;
        const createdBy = req.user._id;

        const event = new Event({ name, description, time, location, type, createdBy });

        await event.save();

        res.status(200).json({
            code: 201,
            status: true,
            message: "Event Created Successfully"
        })
    } catch (error) {
        next(error);
    }
}

const displayEventController = async (req, res, next) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).populate("events");

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
            message: user.events
        });
    } catch (error) {
        next(error)
    }
}

const eventInfo = async (req, res, next) => {
    try {
        const id = String(req.params.groupId);

        const currentUserId = req.user._id;

        const eventId = new ObjectId(id);

        const group = await Event.findOne({_id: eventId});

        const ownerId = group.createdBy;
        const owner = new ObjectId(ownerId);

        const { firstName, lastName, _id } = await User.findOne({_id: owner});

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

const editEventInfo = async (req, res, next) => {
    try {
        const { name, description, location, type } = req.body;

        const id = String(req.params.eventId);

        const eventId = new ObjectId(id);

        const event = await Group.findOne({_id: groupId});

        event.name = name;
        event.description = description;
        event.location = location;
        event.groupType = type;

        await event.save();

        res.status(200).json({
            code: 200,
            status: true,
            message: "Event Edited Successfully"
        });
    } catch (error) {
        next(error);
    }
}

const showEventInfo = async (req, res, next) => {
    try {
        const id = String(req.params.eventId);

        const eventId = new ObjectId(id);

        const event = await Group.findOne({_id: eventId});

        res.status(200).json({
             code: 200,
             status: true,
             data: event,
        });
    } catch (error) {
        next(error);
    }
}

const deleteEvent = async (req, res, next) => {
    try {
        const id = String(req.params.eventId);

        const eventId = new ObjectId(id);

        await Event.findByIdAndDelete(eventId);
        await User.updateMany({ groups: eventId }, { $pull: { groups: eventId } })

        res.status(200).json({
            code: 200,
            status: true,
            message: "Event Deleted Successfully"
        })
    } catch (error) {
        next(error);
    }
}

export { homeController, groupController, eventController, displayGroupController, groupInfo, editGroupInfo, showGroupInfo, deleteGroup, searchUsers, addUser, generateLink, joinViaLink, latestGroup, allGroups, joinGroup, leaveGroup, displayEventController, eventInfo, editEventInfo, showEventInfo, deleteEvent }