import { Event } from "../models/index.js";
import { ObjectId } from "mongodb";

const isEventCreator = async (req, res, next) => {
    try {
        const id = String(req.params.eventId);

        const eventId = new ObjectId(id);

        const event = await Event.findById(eventId);

        if (!event) {
            res.code = 404;
            throw new Error("Group Not Found")
        }

        if (event.createdBy.toString() !== req.user._id.toString()) {
            res.code = 404;
            throw new Error("You Don't Have Permission To Perform This Action")
        }

        next();
    } catch (error) {
        next(error);
    }
}

export default isEventCreator;