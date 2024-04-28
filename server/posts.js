import { Posts } from "./postsmodel.js";
import {uploadOnCloudinary} from './cloudinary.js'
import { User } from "./model.js";
const posting = async(req,res)=>{
    const {title,content} = req.body
    if(!title||!content){
        console.log("All fields are required");
        return res.status(301)
    }
    const postimgpath = req.files?.postimg[0]?.path
    if(!postimgpath){
        console.log("All fields are required");
        return res.status(301)
    }
    const postimg=await uploadOnCloudinary(postimgpath)
    if(!postimg){
        console.log("All fields are required");
        return res.status(301)
    }
//    const authors = await User.find(req?.user?._id)
    const post = await Posts.create({
        title,
        content,
        postimg:postimg.url,
        author:req?.user?._id
    })
    if(!post){
        console.log("something went wrong");
        return res.status(301)
    }
    else{
        console.log("Posted");
        return res.status(200).json(post)
    }
}
const getPosts = async(req,res)=>{
    const users = await Posts.find()
    console.log(users);
    return res.status(200).json(users)
}
const deletepost=async(req,res)=>{
    const deletep= await Posts.deleteOne(req?.user?.post)
    console.log(deletep);
    console.log("Post Deleted");
    return res.status(200).json(deletep)
}
export {posting,getPosts,deletepost}