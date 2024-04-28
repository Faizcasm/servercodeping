import { User } from "./model.js";
import {uploadOnCloudinary} from './cloudinary.js'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
const generateTokens =async(userId)=>{
   try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    user.accessToken=accessToken
    await user.save({validateBeforeSave:false});
    return {accessToken}
   } catch (error) {
    console.log("Something went wrong generatinmg tokens");
   }
}

const register =async(req,res)=>{
    const {username,email,password} = req.body
    if(!username||!email){
        console.log("All fields required");
        return res.status(301)
    }
    if(!password){
        console.log("Password is required");
        return res.status(301)
    }
    const user = await User.findOne({email:email})
    if(user){
        console.log("User already exists");
        return res.status(301)
    }
    const avatarfilepath = req.files?.avatar[0]?.path
    if(!avatarfilepath){
        console.log("path missing");
        return res.status(301)
    }
    const avatar = await uploadOnCloudinary(avatarfilepath)
    if(!avatar){
        console.log("Avatar required");
        return res.status(301)
    }
    // const hashedpass = await bcrypt.hash(password,10)
    const cretedUser=await User.create({
        email,
        username,
        password,
        avatar:avatar.url
    })
    if(!cretedUser){
        console.log("register failed");
        return res.status(301)
    }
    else{
        console.log("Register success");
        return res.status(200).json(cretedUser)
    }
}


//login

const login =async(req,res)=>{
    const {username,password} = req.body
    if(!username){
        console.log("All fields required");
        return res.status(301)
    }
    if(!password){
        console.log("Password is required");
        return res.status(301)
    }
    const user = await User.findOne({username:username})
    console.log(user);
    if(!user){
        console.log("User not exists");
        return res.status(301)
    }

    const isPASSok =  await user.isPasswordCorrected(password)
    if(!isPASSok){
        try {
        console.log("Password did not match :",isPASSok);
        return res.status(401)

        } catch (error) {
            console.log("Ispasswordcorrected have issues",error);
            return res.status(401)
        }
    }
    else{
        const {accessToken} = await generateTokens(user._id)
        console.log("login success");
        return res.status(200).cookie('accessToken',accessToken,{secure:true,httpOnly:true})
       .json({user:user,accessToken})
    }
}
const logout = async(req,res)=>{
const user =await User.findById(req?.user?._id)
console.log(user);
return res.status(200)
.clearCookie('accessToken',{secure:true,httpOnly:true}).json({message:"Logout success",user})
}
const getUser = async(req,res)=>{
    const user = await req.user
    console.log(user);
    setTimeout(()=>{
        user
    },1000)
    return res.status(200).json(user)
}
const changePassword =async(req,res)=>{
    const {oldPassword,newPassword} = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrected(oldPassword)

    if (!isPasswordCorrect) {
        console.log("invalid old password");
        return res.status(301)
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json((200, {}, "Password changed successfully"))
}
const updateAccountDetails =async(req, res) => {
    const {newusername, newemail} = req.body

    if (!newusername || !newemail) {
        console.log("All fielda are required");
        return res.status(301)
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username:newusername,
                email: newemail
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json((200, user, "Account details updated successfully"))
};


//nodemailer
const mailer = async(req,res)=>{
    const {from,subject,message} =req.body
    const to = "ebomber156@gmail.com"
    const transport = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:"clownm18@gmail.com",
            pass:"qqpx zpwx ogfv smtr"
        }
    })
    const mailoptions = {
        from:from,
        to:to,
        subject:subject,
        text:message
    }
    transport.sendMail(mailoptions,function(err,info){
        if(err){
            console.log("Something went wrong",err);
            return res.status(401)
        }
        console.log("Mail sended  :",info);
        return res.status(200).json(info)
    })
}

export {register,login,logout,getUser,changePassword,updateAccountDetails,mailer}