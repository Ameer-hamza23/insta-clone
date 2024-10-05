import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateAccessTokenAndSetCookies.js";
import getDataURI from "../utils/dataURI.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post_model.js";

const register = async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ status: false, message: "All Field are Rewuired!" })
    }

    const userExist = await User.findOne({ email })
    if (userExist) {
        return res.status(401).json({ status: false, message: "User Already Exists" })
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await new User({
        username,
        email,
        password: hashPassword,
        verifyToken: verificationToken,
        verifyTokenExpiredAt: Date.now() + 24 * 60 * 60 * 1000
    });

    await user.save();

    generateTokenAndSetCookie(res, user._id)

    return res.json({ status: true, message: "user Created Successfully", user });
}


// Login 
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'All fields are required!' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: false, message: "Invalid email or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ status: false, message: "Invalid email or password" });
        }

        // Generate token and set cookie
        generateTokenAndSetCookie(res, user._id);

        // Populate user posts (filter only those authored by the user)
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                try {
                    const post = await Post.findById(postId);
                    if (post && post.author.equals(user._id)) {
                        return post;
                    }
                    return null;
                } catch (error) {
                    console.error(`Error fetching post with ID ${postId}: ${error}`);
                    return null;
                }
            })
        ).then(posts => posts.filter(post => post !== null)); // Filter out null posts

        return res.status(200).json({
            status: true,
            message: `Welcome ${user.username}`,
            user,
            populatedPosts,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};


// Logout 
const logout = async (_, res) => {
    try {
        res.cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === 'production', // Only secure in production
        }).status(200).json({ status: true, message: "You have logged out successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};


// Get Profile
const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ status: false, message: "User ID not provided" });
        }

        const user = await User.findById(userId)
            .populate({ path: 'posts', options: { sort: { createdAt: -1 } } })
            .populate('bookmarks');


        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        console.log(user);


        return res.status(200).json({ status: true, message: "Profile fetched successfully", user });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};


// Edit Profile 
const editProfile = async (req, res) => {
    try {
        const userId = req.id
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponce;

        console.log(bio,gender,profilePicture);
        

        if (profilePicture) {
            const fileURI = getDataURI(profilePicture)
            cloudResponce = await cloudinary.uploader.upload(fileURI);
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ status: false, message: "User Not Found" })
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponce.secure_url;

        await user.save();
        return res.status(200).json({ status: true, message: "Your Profile Update Successfully", user })
    } catch (err) {
        console.log(err)
    }

}
const getSuggestedUser = async (req, res) => {
    try {
        // Fetch suggested users excluding the current user
        const suggestedUsers = await User.find({ _id: { $ne: req.id } });

        // Check if no users were found
        if (suggestedUsers.length === 0) {
            return res.status(404).json({ status: false, message: "No Users Found" });
        }

        // Return the list of suggested users
        return res.status(200).json({ status: true, message: "Suggested Users", users: suggestedUsers });
    } catch (error) {
        // Handle any errors that occur
        console.error("Error fetching suggested users:", error);
        return res.status(500).json({ status: false, message: "Failed to fetch suggested users" });
    }
};

const followAndUnfollow = async (req, res) => {
    try {
        const followById = req.id;
        const followToId = req.params.id;

        // Prevent a user from following themselves
        if (followById === followToId) {
            return res.status(400).json({ status: false, message: "You can't follow yourself" });
        }

        // Find the users involved in the follow/unfollow action
        const user = await User.findById(followById);
        const followToUser = await User.findById(followToId);

        // Check if either user does not exist
        if (!user || !followToUser) {
            return res.status(400).json({ status: false, message: "User not found" });
        }

        // Check if the user is already following the target user
        const isFollowing = user.following.includes(followToId);
        if (isFollowing) {
            // Unfollow the user
            await Promise.all([
                User.updateOne({ _id: followById }, { $pull: { following: followToId } }),
                User.updateOne({ _id: followToId }, { $pull: { followers: followById } })
            ]);
            // user.save()
            return res.status(200).json({ status: true, message: `You just unfollowed ${followToUser.username}` });
        } else {
            // Follow the user
            await Promise.all([
                User.updateOne({ _id: followById }, { $push: { following: followToId } }),
                User.updateOne({ _id: followToId }, { $push: { followers: followById } })
            ]);
            // user.save()
            return res.status(200).json({ status: true, message: `You just followed ${followToUser.username}` });
        }
    } catch (error) {
        // Handle any errors that occur
        console.error("Error in follow/unfollow operation:", error);
        return res.status(500).json({ status: false, message: "Failed to follow/unfollow user" });
    }
};


export { register, login, logout, getProfile, editProfile, getSuggestedUser, followAndUnfollow }