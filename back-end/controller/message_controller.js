import { Conversation } from "../models/conversatation_model.js";
import { Message } from "../models/message_model.js";
import { getRecieverSocketId, io } from "../socket/socket.js";

const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const recieverId = req.params.id;
        const { message } = req.body;

        // Find existing conversation or create a new one
        let conversation = await Conversation.findOne({ participants: { $all: [senderId, recieverId] } });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recieverId],
                message: [] // Initialize message array if conversation is new
            });
        }

        // Create the new message
        const newMessage = await Message.create({
            senderId,
            recieverId,
            message
        });

        // Ensure conversation.message is initialized
        if (!conversation.message) {
            conversation.message = [];
        }

        // Add the message to the conversation
        conversation.message.push(newMessage._id);

        // Save both conversation and message
        await Promise.all([conversation.save(), newMessage.save()]);

        // Send message to recipient if online
        const recieveSocketId = getRecieverSocketId(recieverId);
        if (recieveSocketId) {
            io.to(recieveSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({ status: true, newMessage, message: "The chat has started" });
    } catch (error) {
        console.error("Error in sendMessage:", error);
        return res.status(500).json({ status: false, message: "Failed to send message" });
    }
};


const getMessages = async (req, res) => {

    try {
        const senderId = req.id;
        const recieverId = req.params.id;
        let conversation = await Conversation.findOne({ participants: { $all: [senderId, recieverId] } }).populate('message ');;

        if (!conversation) return res.status(202).json({ status: true, messages: [], message: "Not awailable old chats" });

        return res.status(201).json({ status: true, messages: conversation.message, message: "Awailable old chats" });
    } catch (error) {
        console.log(error);

    }
}

export { sendMessage, getMessages }