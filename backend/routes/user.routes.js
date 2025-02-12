import express from 'express'
import { signup , login ,logout ,getProfile, editProfile, suggestedUser ,freindsOrunfreinds, searchUser, getFriends } from '../controller/user.controller.js'
import {isAuthenticated} from '../middlewares/isAuthenticated.js'
import upload from '../middlewares/multer.js'
const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/profile/:id').get(isAuthenticated,getProfile);
router.route('/profile/editprofile').post(isAuthenticated, upload.fields([{ name: 'profilePhoto' }, { name: 'coverPhoto' }]), editProfile);
router.route('/suggesteduser').get(isAuthenticated,suggestedUser);
router.route('/friendorunfreind').get(isAuthenticated,freindsOrunfreinds);
router.route('/search').get(isAuthenticated,searchUser);
router.route('/friends').get(isAuthenticated,getFriends)



export default router;
