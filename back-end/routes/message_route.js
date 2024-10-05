import {Router} from "express";
import isAuthenticate from "../middleware/isAuth.js";
import { getMessages, sendMessage } from "../controller/message_controller.js";

const route = Router();

route.post('/send/:id',isAuthenticate,sendMessage);
route.get('/getAll/:id',isAuthenticate,getMessages);

export default route;