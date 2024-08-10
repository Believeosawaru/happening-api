import { Group } from "../models/index.js";
import { ObjectId } from "mongodb";

const isGroupCreator = async (req, res, next) => {
    try {
        const id = String(req.params.groupId);

        const groupId = new ObjectId(id);

        const group = Group.findById(groupId);

        if (!group) {
            res.code = 404;
            throw new Error("Group Not Found")
        }

        if (group.createdBy.toString() !== req.user._id.toString()) {
            res.code = 404;
            throw new Error("You Don't Have Permission To Perform This Action")
        }

        next();
    } catch (error) {
        next(error);
    }
}

export default isGroupCreator;