import { Router } from "express";
import { editProfile, followAndUnfollow, getProfile, getSuggestedUser, login, logout, register } from "../controller/user_controller.js";
import isAuthenthicate from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const route = Router();

route.post('/register',register)
route.post('/login',login)
route.post('/logout',isAuthenthicate,logout)
route.get('/getProfile/:id',isAuthenthicate,getProfile)
route.post('/editProfile',isAuthenthicate,upload.single("profilePicture"),editProfile)
route.get('/otheruser',isAuthenthicate,getSuggestedUser)
route.post('/follow/:id',isAuthenthicate,followAndUnfollow)

export default route;