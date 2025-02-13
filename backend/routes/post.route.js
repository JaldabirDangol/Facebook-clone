import express from 'express'
import upload from '../middlewares/multer.js'
import { getAllPost ,addNewPost ,postReaction ,addComment ,getCommentOfPost ,deletePost , savedPost, sharePost} from '../controller/post.controller.js';
import {isAuthenticated} from '../middlewares/isAuthenticated.js'

const router = express.Router();
router.route('/getallpost').get(isAuthenticated,getAllPost);
router.route('/addpost').post(isAuthenticated,upload.single("photo"),addNewPost);
router.route('/:id/reaction').post(isAuthenticated,postReaction);
router.route('/:id/comment').post(isAuthenticated,addComment);
router.route('/getallcomment').get(isAuthenticated,getCommentOfPost);
router.route('/delete/:id').delete(isAuthenticated,deletePost);
router.route('/:id/savepost').get(isAuthenticated,savedPost);
router.route('/:id/sharepost').post(isAuthenticated,sharePost)


export default router;