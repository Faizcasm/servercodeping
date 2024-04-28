import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import {createServer} from 'http'
const app =express()
const server = createServer(app)
const port =500;
dotenv.config({
    path:'./.env'
})
const DemoSchema = new mongoose.Schema({name:String},{timestamps:true})
const Demo = mongoose.model('demoo',DemoSchema)
const database = async()=>{
    try {
        const connect = await mongoose.connect(`${process.env.url}/mooodmedia`)
        console.log("connected ",connect.connection.host);
    } catch (error) {
        console.log(error);
    }
}
database()
.then(listen=>{
    server.listen(port,()=>{
        console.log(port);
    })
})
.catch(err=>{
    console.log(err);
})

app.post('/',async(req,res)=>{
    const {name}=req.body
    const user=await Demo.create({
        name:name
    })
     res.send("i am also working")
    return res.status(200).json({message:"We gOT it",user})
    })
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())
const options={
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(options))
import router from './router.js'
app.use('/',router)
