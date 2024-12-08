import User from "../model/user.js";
import { sendError, sendSuccess, sendValidationError } from "../utils/response.js";
import { validateSearchContacts } from "../utils/validation/user_validation.js";

export const searchContacts = async (req,res) => {
    const {username} = req.body
    const {error,value} = validateSearchContacts(req.body);

    if(error){
        const errorMessages = error.details.map(detail => detail.message);
        return sendValidationError(res,errorMessages,null,400);
    }

    try {
        const regex = new RegExp(username,"i");
        const contacts = await User.find({
            $and:[
                {_id: {$ne: req.user}},
                {username: regex }
            ]
        })
        console.log(username,contacts)
        return sendSuccess(res,`Searched Users Successfully.`,contacts,200);

    } catch (error) {
        console.error('Searching User Error:', error);
        return sendError(res,'Searching Users failed. Try again later',null,500)
    }
}