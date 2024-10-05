import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post_model.js";
import { User } from "../models/user_model.js";
import { Comment } from "../models/comment_model.js";
import { getReceiverSocketId } from "../socket/socket.js";

const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) {
            return res.status(401).json({ status: false, message: "Image Required" });
        }

        // Resize and optimize the image using sharp
        const optimizedImage = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // Convert image buffer to Data URI
        const dataURI = `data:image/jpeg;base64,${optimizedImage.toString('base64')}`;

        // Upload the image to Cloudinary and await the result
        const cloudResponce = await cloudinary.uploader.upload(dataURI);

        // Create a new post with the image URL from Cloudinary
        const post = await Post.create({
            caption,
            image: cloudResponce.secure_url, // Use secure_url to get the image URL
            author: authorId
        });

        // Update the user's posts
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        // Populate the author's details in the post
        await post.populate({ path: 'author', select: "-password" });

        return res.status(201).json({ status: true, message: "New Post Added Successfully", post });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Server Error" });
    }
}


const getAllPosts = async (req, res) => {

    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author' })
            .populate({
                path: 'comments', sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: 'username profilePicture'
                }
            });

        return res.status(201).json({
            posts,
            status: true,
            message: "All Post Send"
        });

    } catch (error) {
        console.log(error);
    }
}

const getUserPost = async (req, res) => {

    try {

        const userId = req.id;
        const posts = await Post.find({ author: userId, }).sort({ createdAt: -1 }).populate({ path: "author", select: "username,profilePicture" })
            .populate({
                path: 'comments', sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: 'username,profilePicture'
                }
            });
        return res.status(201).json({
            posts,
            status: true,
            message: "All Post Send"
        });

    } catch (error) {
        console.log(error);

    }
}

const likePost = async (req, res) => {
    try {

        const likedByUser = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const userLikedPost = await User.findById(likedByUser)

        if (!post) return res.status(401).json({ status: false, message: "Post not Found" });

        await post.updateOne({ $addToSet: { likes: likedByUser } })
        await post.save();

        // implement socket io for real time notification
        const user = await User.findById(likedByUser).select('username profilePicture');

        const postOwnerId = post.author.toString();
        if (postOwnerId !== likedByUser) {
            // emit a notification event
            const notification = {
                type: 'like',
                userId: likedByUser,
                userDetails: user,
                postId,
                message: 'Your post was liked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(201).json({ status: true, message: `${userLikedPost.username} Liked your Post ${post}` })

    } catch (error) {

    }
}

const dislikePost = async (req, res) => {
    try {

        const likedByUser = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const userLikedPost = await User.findById(likedByUser)

        if (!post) return res.status(401).json({ status: false, message: "Post not Found" });

        await post.updateOne({ $pull: { likes: likedByUser } })
        await post.save();

        // implement socket io for real time notification
        const user = await User.findById(likedByUser).select('username profilePicture');

        const postOwnerId = post.author.toString();
        if (postOwnerId !== likedByUser) {
            // emit a notification event
            const notification = {
                type: 'dislike',
                userId: likedByUser,
                userDetails: user,
                postId,
                message: 'Your post was disliked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(201).json({ status: true, message: `${userLikedPost.username} DisLiked your Post ${post}` })

    } catch (error) {
        console.log(error)
    }
}

const addComment = async (req, res) => {
    try {
        const commentByUser = req.id;  // User ID from the request
        const postId = req.params.id;  // Post ID from the URL parameters
        const { text } = req.body;  // Comment text from the request body

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ status: false, message: "This Post is Not Available!" });
        if (!text || text.trim() === '') return res.status(400).json({ status: false, message: "Empty Comment can't be saved" });

        // Create a new comment
        const comment = await Comment.create({
            text,
            author: commentByUser,
            post: postId
        });

        // Populate the author field (after creation)
        await comment.populate({ path: "author", select: "username profilePicture" });

        // Add the comment to the post's comments array
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({ status: true, message: "Comment added Successfully", comment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}


const getComments = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId }).populate({ path: "author", select: "username,profilePicture" });
        if (!comments) return res.status(401).json({ status: false, message: "Comments Not Found" });

        return res.status(201).json({ status: true, message: "Comments Get Successfully", comments });
    } catch (error) {
        console.log(error);

    }
}

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) return res.status(401).json({ status: false, message: "Post Not Found" });

        // Check if the author is the same as the user requesting deletion
        if (post.author.toString() !== authorId) {
            return res.status(401).json({ status: false, message: "Unauthorized Access" });
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);

        // Find the user by ID
        let user = await User.findById(authorId); // Add 'await' here
        if (!user) return res.status(404).json({ status: false, message: "User Not Found" });

        // Filter out the deleted post from the user's posts
        user.posts = (user.posts || []).filter((id) => id.toString() !== postId);

        // Save the updated user
        await user.save();

        // Delete all comments associated with the post
        await Comment.deleteMany({ post: postId }); // Use postId instead of authorId

        return res.status(201).json({ status: true, message: "Successfully Deleted Post" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Server Error" });
    }
};


const bookmarkPosts = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(401).json({ status: false, message: "Post Not Found" });

        const user = await User.findById(userId);
        if (user.bookmarks.includes(post._id)) {

            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(201).json({ status: true, message: "Remove from Bookmark", type: "Unsaved" });
        } else {
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(201).json({ status: true, message: `You BookMarked this post.`, type: "Unsaved" });
        }
    } catch (error) {

    }
}
export { addNewPost, getAllPosts, getUserPost, likePost, dislikePost, addComment, getComments, deletePost, bookmarkPosts }