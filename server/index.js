import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
const app =express()
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
    app.listen(port,()=>{
        console.log(port);
    })
})
.catch(err=>{
    console.log(err);
})

app.get('/',async(req,res)=>{
     res.send("Codeping server is up ")
    })

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())
app.use('/', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type , Accept');
    res.header('Content-type','text/plain, application/octet-stream , application/json ,image/apng,image/avif')
  next();
});
const options={
    origin:'http://localhost:5173',
    credentials:true,
     methods: ["GET", "POST","PUT","DELETE"],
}
app.use(cors(options))
import router from './router.js'
app.use('/',router)
