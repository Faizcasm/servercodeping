import mongoose,{Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const userSchema = new Schema({
username:String,
email:String,
password:String,
avatar:String,
accessToken:String
},{timestamps:true})
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 2)
    next()
})

userSchema.methods.isPasswordCorrected = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken=function(){
  return  jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email
    },"secret",{expiresIn:'30d'})
}

export const User = mongoose.model('express',userSchema)