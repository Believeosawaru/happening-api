import { ObjectId } from "mongodb";
import { Event, Group } from "../models/index.js";
import { User } from "../models/index.js";
import InviteToken from "../models/inviteToken.js";
import generateInviteToken from "../utils/generateInviteLink.js";
import sendEventLink from "../utils/sendEventLink.js";
import sendGroupMail from "../utils/sendGroupLink.js";
import assignCategory from "../utils/assignCategory.js";

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
                message: "User Is Not Verified"
            })
        } else {
            res.status(200).json({
                code: 200,
                status: true,
                message: `${userName}`,
                data: user.notifications.length
            });
        }
    } catch (error) {
        next(error);
    }
} 

const myProfile = async (req, res, next) => {
    try {
        const userName = req.user.firstName;
        const email = req.user.email;

        const user = await User.findOne({email}).populate("groups events")

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
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    groups: user.groups,
                    events: user.events,
                    followers: user.followers.length,
                    following: user.following.length,
                    bio: user.bio,
                    profilePicture: user.profilePicture
                }
            });
        }
    } catch (error) {
        next(error);
    }
}

const userProfile = async (req, res, next) => {
    try {
        const id = String(req.params.userId);
        const userId = new ObjectId(id);
        const email = req.user.email;

        let isFollowing = false;

        const user = await User.findById(userId).populate("groups events");

        const owner = await User.findOne({ email });

        if (owner.following.includes(userId)) {
            isFollowing = true;
        }

        if (!user) {
            res.status(404).json({
                code: 404,
                status: false,
                message: "User Not Found",
            })
        }

        if (user.isVerified === false) {
            res.status(403).json({
                code: 403,
                status: false,
                message: "You're Not Verified"
            })
        } else {
            res.status(200).json({
                code: 200,
                status: true,
                isFollowing,
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    groups: user.groups,
                    events: user.events,
                    following: user.following.length,
                    followers: user.followers.length,
                    bio: user.bio,
                    profilePicture: user.profilePicture
                }
            });
        }
    } catch (error) {
        next(error);
    }
}

const myBio = async (req, res, next) => {
    try {
        const { bio } = req.body;
        const email = req.user.email;

        const user = await User.findOne({ email });

        if (!user) {
            res.code = 404;
            throw new Error("User Not Found");
        }

        if (user.isVerified === false) {
            res.status(403).json({
                code: 403,
                status: false,
                message: "You're Not Verified"
            })
        } else {
            user.bio = bio;
            await user.save();

            res.status(200).json({
                code: 200,
                status: true,
                message: "Bio Created Successfully"
            })
        }
    } catch (error) {
        next(error);
    }
}

const followUser = async (req, res, next) => {
    try {
        const id = String(req.params.userId);
        const userId = new ObjectId(id);
        const myId = req.user._id

        const user = await User.findById(myId);
        const followee = await User.findById(userId);

        if (!user || !followee) {
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
                message: "You're Not Verified"
            })
        }

        if (!user.following.includes(userId) && !followee.followers.includes(myId)) {
            user.following.push(userId)
            followee.followers.push(myId)
        } else {
            res.code = 400;
            throw new Error("You're Already Following This User")
        }

        followee.notifications.push({ 
            message: `<a href="user-profile.html?userId=${user._id}">${user.firstName} ${user.lastName} Just Followed You</a>`
        });

        await user.save();
        await followee.save();
        
        res.status(200).json({
            code: 200,
            status: true,
            message: "Followed User"
        });
    } catch (error) {
        next(error);
    }
}

const unfollowUser = async (req, res, next) => {
    try {
        const id = String(req.params.userId);
        const userId = new ObjectId(id);
        const myId = req.user._id

        const user = await User.findById(myId);
        const followee = await User.findById(userId);

        if (!user || !followee) {
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
                message: "You're Not Verified"
            })
        }

        if (user.following.includes(userId) && followee.followers.includes(myId)) {
            user.following = user.following.filter(followeeId => !followeeId.equals(userId));

            followee.followers = followee.followers.filter(followerId => !followerId.equals(myId));
        } else {
            res.code = 400;
            throw new Error("You're Not Following This User")
        }

        await user.save();
        await followee.save();
        
        res.status(200).json({
            code: 200,
            status: true,
            message: "Unfollowed User"
        });
    } catch (error) {
        next(error);
    }
}

const myNotifications = async (req, res, next) => {
    try {
        const myId = req.user._id

        const user = await User.findById(myId);

        if (!user) {
            res.status(404).json({
                code: 404,
                status: false,
                message: "User Not Found"
            });
        }

        if (user.isVerified === false) {
            res.status(403).json({
                code: 403,
                status: false,
                message: "You're Not Verified"
            })
        }

        res.status(200).json({
            code: 200,
            status: true,
            data: user.notifications
        });
    } catch (error) {
        next(error);
    }
}

const uploadPicture = async (req, res, next) => {
    try {
        const email = req.user.email;

        const user = User.findOne({email});

        user.profilePicture = req.file.filename;

        await user.save();

        res.status(200).json({
            code: 200,
            status: true,
            data: req.file.filename
        });
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
            message: "Group Created Successfully",
            data: group._id
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
        const userId = new ObjectId(String(req.user._id));

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
        const userId = new ObjectId(String(req.user._id));
        const groupId = new ObjectId(id);

        const group = await Group.findByIdAndDelete(groupId);
        const user = await User.findById(userId);
        
        await User.updateMany({ groups: groupId }, { $pull: { groups: groupId } });

        user.notifications.push({ 
            message: `You deleted Group: ${group.name}`
        });  

        await user.save();
        
        res.status(200).json({
            code: 200,
            status: true,
            message: "Group Deleted Successfully"
        });
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
        
        const user = await User.findByIdAndUpdate(userId, { $addToSet: { groups: group._id } });

        user.notifications.push({ 
            message: `<a href="group-details.html?groupId=${group._id}">You Were Added To The Group ${group.name}</a>`
        });

        res.status(200).json({
            code: 200,
            status: true,
            message: "Member Added Successfully"
        });
    } catch (error) {
        next(error);
    }
}

const generateLink = async (req, res, next) => {
    try {
        const id = String(req.params.groupId);
        const groupId = new ObjectId(id);
        const userId = new ObjectId(String(req.user._id));

        const group = await Group.findById(groupId);
        
        if (!group) {
            res.code = 404;
            throw new Error("Group Not Found")
        }

        if (group.createdBy === userId) {
                const groupToken = generateInviteToken();
            
                const inviteToken = new InviteToken({ token: groupToken, groupId });

                const inviteLink = `https://http://5.161.186.15/./html/groups/join-link.html?groupToken=${groupToken}/`

                group.inviteLink = inviteLink;

                await inviteToken.save();
                group.save();

                res.status(201).json({
                    code: 201,
                    status: true,
                    message: "Link Successfully Created",
                    data: inviteLink
                });
        } else {
            res.code = 400;
            throw new Error("You don't have access to perform this task")
        }
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

const searchUsersEmail = async (req, res, next) => {
    try {
        const { query } = req.query;

        const id = String(req.params.groupId);

        const groupId = new ObjectId(id);

        const group = await Group.findById(groupId);

        if (!group) {
            res.code = 404;
            throw new Error("Group Not Found");
        }

        if (!query) {
            res.code = 400;
            throw new Error("No Name Provided");
        }

        const user = await User.find({
            _id: { $nin: [...group.members, group.createdBy] },
            isVerified: true,
            $or: [
                {firstName: {$regex: query, $options: "i"}}, {lastName: {$regex: query, $options: "i"}}
            ]
        }).select("firstName lastName")

        if (!user) {
            res.code = 404;
            throw new Error("No User With That Name");
        }

        res.status(200).json({
            code: 200,
            status: true,
            user
        })
    } catch (error) {
        next(error);
    }
}

const sendGroupLink = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const id = new ObjectId(String(userId));
        const groupId = new ObjectId(String(req.params.groupId));

        const user = await User.findOne({ _id: id });
        const group = await Group.findOne({ _id: groupId });
        const createdBy = await User.findOne({ id: group.createdBy })

        const groupToken = generateInviteToken();
        
        const inviteToken = new InviteToken({ token: groupToken, groupId });

        const inviteLink = `https://happening-khaki.vercel.app/html/groups/join-link.html?groupToken=${groupToken}/`

        group.inviteLink = inviteLink;

        await inviteToken.save();
        group.save();

        await sendGroupMail({
            emailTo: user.email,
            subject: "You're Invited To A Group"
        }, {
            groupName: group.name,
            groupLocation: group.location,
            createdBy,
            inviteLink
        });

        user.notifications.push({ message: `<a href="group-details.html?groupId=${group._id}">You Are Invited To ${group.name}, Check Your Mail For The Link.</a>`});

        await user.save();

        res.status(200).json({
            code: 200,
            status: true,
            message: `Invitation Sent To ${user.firstName} ${user.lastName}`
        })
    } catch (error) {
        next(error);
    }
}

// End Of Groups Routes

// Start Of Events Routes

const eventController = async (req, res, next) => {
    try {
        const { name, description, date, time, timeZone, location, type } = req.body;
        const createdBy = String(req.user._id);
        const currentUser = new ObjectId(createdBy);
        const category = await assignCategory(name, description);

        const event = new Event({ name, description, date, time, timeZone, location, category, type, createdBy });

        const user = await User.findById(currentUser);
        user.events.push(event._id);

        await event.save();
        await user.save();

        res.status(200).json({
            code: 201,
            status: true,
            message: `Event Created Successfully`
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
        const id = String(req.params.eventId);

        const currentUserId = req.user._id;

        const eventId = new ObjectId(id);

        const event = await Event.findOne({_id: eventId});

        const ownerId = event.createdBy;
        const owner = new ObjectId(String(ownerId));

        const { firstName, lastName, _id } = await User.findOne({_id: owner});

        res.status(200).json({
             code: 200,
             status: true,
             data: event,
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
        const { name, description, date, time, timeZone, location, type } = req.body;

        const id = String(req.params.eventId);

        const eventId = new ObjectId(id);

        const event = await Event.findOne({_id: eventId});

        event.name = name;
        event.description = description;
        event.date = date;
        event.time = time;
        event.timeZone = timeZone;
        event.location = location;
        event.type = type;

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

        const event = await Event.findOne({_id: eventId});

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
        });
    } catch (error) {
        next(error);
    }
}

const allEvents = async (req, res, next) => {
    try {
        const id = String(req.user._id);
        const userId = new ObjectId(id);

        const publicEvents = await Event.find({ 
            type: "public",
            createdBy: { $ne: userId }
        });

        res.status(200).json({
            code: 200,
            status: true,
            message: publicEvents
        });
    } catch (error) {
        next(error)
    }
}

const latestEvent = async (req, res, next) => {
    try {
        const id = String(req.user._id);
        const userId = new ObjectId(id);

        const user = await User.findById(userId);

        if (!user) {
            res.code = 404;
            throw new Error("No User Found");
        }

        if (user.events.length > 0) {
             const lastEvent = user.events[user.events.length - 1];
            
             const Eid = String(lastEvent);
             const eventId = new ObjectId(Eid);

             const event = await Event.findById(eventId);

             res.status(200).json({
                code: 200,
                status: true,
                message: event
             });
        } else {
            res.code = 404;
            throw new Error("No Recent Events");
        }
    } catch (error) {
        next(error)
    }
}

const searchUserEvent = async (req, res, next) => {
    try {
        const { query } = req.query;

        const id = String(req.params.eventId);

        const eventId = new ObjectId(id);

        const event = await Event.findById(eventId);

        if (!event) {
            res.code = 404;
            throw new Error("Event Not Found")
        }

        if (!query) {
            res.code = 400;
            throw new Error("No Name Provided");
        }

        const users = await User.find({
            _id: { $nin: [...event.invitedUsers, event.createdBy] },
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

const sendEventIv = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const id = new ObjectId(String(userId));
        const eventId = new ObjectId(String(req.params.eventId));

        const user = await User.findOne({ _id: id });
        const event = await Event.findOne({ _id: eventId });

        const inviteLink = `https://happening-khaki.vercel.app/html/events/join-event.html?eventId=${eventId}`

        await sendEventLink({
            emailTo: user.email,
            subject: "You're Invited To An Event"
        }, {
            eventName: event.name,
            eventDate: event.date,
            eventTime: event.time,
            eventLocation: event.location,
            inviteLink
        });

        res.status(200).json({
            code: 200,
            status: true,
            message: `Invitation Sent To ${user.firstName} ${user.lastName}`
        })
    } catch (error) {
        next(error);
    }
}

const eventJoin = async (req, res, next) => {
    try {
        const eventId = new ObjectId(String(req.params.eventId));

        const event = await Event.findOne({ _id: eventId });

        const userId = new ObjectId(String(req.user._id));

        const user = await User.findById(userId)

        if (!event) {
            res.code = 404;
            throw new Error("Event Not Found");
        }

        if (event.invitedUsers.includes(req.user._id)) {
            res.code = 400;
            throw new Error("You Are Already Attending This Event");
        }

        if (user.isVerified === false) {
            res.code = 400;
            throw new Error("You Are Not Verified");
        }

        event.invitedUsers.push(req.user._id);
        user.events.push(eventId);

        await event.save();
        await user.save();
        
        res.status(200).json({
            code: 200,
            status: true,
            message: "Request Successful!"
        })
    } catch (error) {
        next(error);
    }
}
 
export { homeController, groupController, eventController, displayGroupController, groupInfo, editGroupInfo, showGroupInfo, deleteGroup, searchUsers, addUser, generateLink, joinViaLink, latestGroup, allGroups, joinGroup, leaveGroup, searchUsersEmail, sendGroupLink, displayEventController, eventInfo, editEventInfo, showEventInfo, deleteEvent, allEvents, latestEvent, searchUserEvent, sendEventIv, eventJoin, myProfile, userProfile, followUser, myBio, unfollowUser, myNotifications, uploadPicture }