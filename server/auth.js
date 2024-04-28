import { User } from "./model.js";
import jwt from 'jsonwebtoken'
export const VerifyToken = async(req,res,next)=>{
    try {
        const token = await req?.cookies?.accessToken;
        console.log(token);
        if(!token){
            console.log("no token available");
            return res.status(402)
        }
        const decoded = await jwt.verify(token,"secret");
        const user = await User.findById(decoded?._id).select("-password")
        if(!user){
            console.log("not a userr");
        return res.status(402)
        }
        req.user=user;
       await next()
    } catch (error) {
        console.log("error in verify token",error);
        return res.status(402)
    }
}
export const VerifyTokenLogout = async(err,req,res,next)=>{
    try {
        const token = await req?.cookies?.accessToken;
        console.log(token);
        if(!token){
            console.log("no token available");
            return res.status(401)
        }
        const decoded = jwt.verify(token,"secret");
        const user = await User.findById(decoded?._id).select("-password")
        if(!user){
            console.log("not a userr");
        return res.status(401)
        }
        req.user=user;
        next()
    } catch (error) {
        console.log("error in verify token",error);
        return res.status(401)
    }
}