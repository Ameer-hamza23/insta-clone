import { Router } from "express";
import isAuthenticate from "../middleware/isAuth.js";
import { addComment, addNewPost, bookmarkPosts, deletePost, dislikePost, getAllPosts, getComments, getUserPost, likePost } from "../controller/post_controller.js";
import upload from "../middleware/multer.js";

const route = Router();

route.post('/addPost',isAuthenticate,upload.single('image'),addNewPost);
route.get('/getAllPosts',isAuthenticate,getAllPosts);
route.get('/allPost/:id',isAuthenticate,getUserPost);
route.post('/likePost/:id',isAuthenticate,likePost);
route.post('/dislikePost/:id',isAuthenticate,dislikePost);
route.post('/addComment/:id',isAuthenticate,addComment);
route.get('/getComment/:id',isAuthenticate,getComments);
route.delete('/deletePost/:id',isAuthenticate,deletePost);
route.post('/addBookmark/:id',isAuthenticate,bookmarkPosts);

export default route;
