import {User} from './model.js'
const admindash = async(req,res)=>{
    const {admin,key} =req.body
    if(admin!=="Faizan"){
console.log("You are not admin");
return res.status(400)
    }
    if(key!=="123"){
        console.log("Key is incorrect");
        return res.status(400)
    }
    else{
        console.log("Admin login");
       return res.status(200).json({message:"Admin Logged in"})
    }
}
const admindata=async(req,res)=>{
    const userdata = await User.find()
    console.log("Data retrieved");
    return res.status(200).json(userdata)
}
export {admindash,admindata}
