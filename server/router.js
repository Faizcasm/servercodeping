import { Router } from "express";
import { upload } from "./multer.js";
import { changePassword, getUser, login, logout, mailer, register, updateAccountDetails } from "./user.js";
import { VerifyToken, VerifyTokenLogout } from "./auth.js";
import {deletepost, getPosts, posting} from "./posts.js";
import payment from "./Payment.js";
import {admindash,admindata} from "./Admis.js";
const router = Router()
router.route('/register').post(upload.fields([
    {
        name:"avatar",
        maxCount:1
    }
]),register)
router.route('/login').post(login)
router.route('/logout').post(VerifyTokenLogout,logout)
router.route('/user').get(VerifyToken,getUser)
router.route('/update').post(VerifyToken,changePassword)
router.route('/updateuser').post(VerifyToken,updateAccountDetails)
router.route('/mailer').post(mailer)
router.route('/post').post(VerifyToken,upload.fields([
    {
        name:'postimg',
        maxCount:1
    }
]),posting)
router.route('/posts').get(VerifyToken,getPosts)
router.route('/delete').delete(VerifyToken,deletepost)
router.route('/payment').post(payment)
router.route('/admin').post(VerifyToken,admindash)
router.route('/admindata').get(VerifyToken,admindata)
export default router