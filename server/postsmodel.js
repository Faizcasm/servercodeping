import mongoose from "mongoose";
const postsSchema = new mongoose.Schema({
    title:String,
    content:String,
    postimg:String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})
export const Posts = mongoose.model('userposts',postsSchema)