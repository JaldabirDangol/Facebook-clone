import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { deleteConversation, deleteMessage, getMessage, sendMessage } from "../controller/message.controller.js";

const router = express.Router();

router.route('/:id/send').post(isAuthenticated,sendMessage);
router.route('/:id/allmessage').get(isAuthenticated,getMessage);
router.route('/:id/deleteconvo').get(isAuthenticated,deleteConversation);
router.route('/delete/:id').delete(isAuthenticated,deleteMessage)

export default router;