import express from 'express'
import upload from '../middlewares/multer.js'
import { getAllPost ,addNewPost ,postReaction ,addComment ,getCommentOfPost ,deletePost , savedPost} from '../controller/post.controller.js';
import {isAuthenticated} from '../middlewares/isAuthenticated.js'

const router = express.Router();
router.route('/getallpost').get(isAuthenticated,getAllPost);
router.route('/addpost').post(isAuthenticated,upload.single("photo"),addNewPost);
router.route('/:id/reaction').get(isAuthenticated,postReaction);
router.route('/:id/comment').post(isAuthenticated,addComment);
router.route('getallcomment').get(isAuthenticated,getCommentOfPost);
router.route('deletepost').delete(isAuthenticated,deletePost);
router.route('savedpost').get(isAuthenticated,savedPost);


export default router;