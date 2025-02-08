import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { deleteConversation, getMessage, sendMessage } from "../controller/message.controller.js";

const router = express.Router();

router.route('/:id/send').post(isAuthenticated,sendMessage);
router.route('/:id/allmessage').get(isAuthenticated,getMessage);
router.route('/:id/deleteconvo').get(isAuthenticated,deleteConversation);

export default router;