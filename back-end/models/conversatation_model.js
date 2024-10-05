// import mongoose from "mongoose";

// const conversationSchema = mongoose.Schema({
//     participants:[{
//         types:mongoose.Schema.Types.ObjectId,
//         ref:"User"
//     }],
//     message:[{
//         types:mongoose.Schema.Types.ObjectId,
//         ref:"Message"
//     }],

// },{timestamps:true});

// export const Conversation = mongoose.model("Conversation",conversationSchema)
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,  // Corrected from 'types' to 'type'
        ref: "User"
    }],
    message: [{
        type: mongoose.Schema.Types.ObjectId,  // Corrected from 'types' to 'type'
        ref: "Message"
    }]
}, { timestamps: true });  // Correct spelling

export const Conversation = mongoose.model("Conversation", conversationSchema);
