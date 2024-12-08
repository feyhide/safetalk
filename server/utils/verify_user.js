import jwt from "jsonwebtoken"
import { sendError } from "./response.js";


export const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token;
    console.log("token is this cookie milgaya :",token)
    if(!token){
        return sendError(res,"Unauthorized",null,401);
    }
    
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) {
            return sendError(res,"Forbidden",null,403);
        }
        req.user = user?.id;
        next();
    })
}