import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentIcon from '@mui/icons-material/Comment';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { Box, Divider, TextField, Button, colors, Tooltip } from '@mui/material';
import CommentsDailog from './CommentsDailog';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { POST, USER } from '../Api';
import toast from 'react-hot-toast';
import { setPost, setSelectedPost } from '../redux/PostSlice';


export default function Post({ post }) {

    const { user } = useSelector(store => store.auth)
    const { posts } = useSelector(store => store.post)
    const dispatch = useDispatch();

    const [text, setText] = React.useState('');
    const [dialogOpen, setDialogOpen] = React.useState(false)

    const handleCommentChange = (e) => {
        setComment(e.target.value)
    }


    const handleDialog = () => {
        setDialogOpen(true)
    }

    const handlerDeletePost = async () => {
        try {
            // Ask for confirmation before making the delete request
            if (user?._id === post?.author?._id) {
                const confirmDelete = window.confirm('Are you sure you want to delete this post?');
                if (!confirmDelete) {
                    return; // Exit the function if the user cancels
                }
            }

            const res = await axios.delete(`${POST}/deletePost/${post._id}`, { withCredentials: true });

            console.log('Delete response:', res.data);

            if (res.data.status) {
                // Update the posts only if the deletion is successful
                const updatedPost = posts.filter((item) => item._id !== post._id);
                dispatch(setPost(updatedPost));

                toast.success(res.data.message);
            }
        } catch (error) {
            console.error('Error:', error.response?.data?.message || error.message);
        }
    };

    const [like, setLike] = React.useState(post.likes.includes(user?._id) || false);  // Assuming you want to check if the user has liked the post
    const [postLikes, setPostLikes] = React.useState(post.likes.length);

    // Like / Dislike handler
    const likeAndDislike = async () => {
        try {
            const action = like ? "dislikePost" : "likePost";  // Toggle action based on the current like state
            const res = await axios.post(`${POST}/${action}/${post._id}`, {}, { withCredentials: true });

            if (res.data.status) {
                const updatedLikesCount = like ? postLikes - 1 : postLikes + 1;  // Adjust the likes count
                setPostLikes(updatedLikesCount);
                setLike(!like);  // Toggle the like state

                const updatedPostData = posts.map(p =>
                    p._id === post._id
                        ? {
                            ...p,
                            likes: like
                                ? p.likes.filter(id => id !== user._id)  // Remove user ID from likes
                                : [...p.likes, user._id]  // Add user ID to likes
                        }
                        : p
                );

                dispatch(setPost(updatedPostData));  // Update the post in the Redux store
                toast.success(res.data.message);  // Show success message
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong, please try again.');
        }
    }

    const [comments, setComments] = React.useState(post.comments);  // Fixed typo (post.comments instead of post.comment)
const [comment, setComment] = React.useState('');  // Assuming this holds the new comment's text

const commentHandler = async () => {
    try {
        const res = await axios.post(`${POST}/addComment/${post._id}`, { text: comment }, { withCredentials: true });
        if (res.data.status) {
            const updatedComments = [...comments, res.data.comment];  // Update comments state
            setComments(updatedComments);  // Fixed typo in setComments

            const updatedPostData = posts.map(p =>
                p._id === post._id ? { ...p, comments: updatedComments } : p  // Also update the posts state
            );
            dispatch(setPost(updatedPostData));

            toast.success(res.data.message);
            setComment('');  // Reset the comment input
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        toast.error('Failed to add comment');
    }
};


    return (
        <Card sx={{ maxWidth: 900, minWidth: 600, mb: 2 }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={post.author.profilePicture}>
                        R
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings" onClick={handlerDeletePost} >
                        <MoreVertIcon />
                    </IconButton>
                }
                title={post.author.username}
                subheader={post.createdAt}
            />
            <CardMedia
                component="img"
                height="auto"
                image={post.image}
                alt="Paella dish"
                sx={{ width: "100%", objectFit: "cover", }}
            />
            <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {post.caption}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Tooltip title="Like">
                    <IconButton aria-label="add to favorites" onClick={()=> {

                        likeAndDislike
                        }}>
                        <FavoriteIcon />
                        <Typography variant='h5'>{postLikes}</Typography>
                    </IconButton>
                </Tooltip >
                <Tooltip title="See All Comments">
                    <IconButton aria-label="Comments" onClick={handleDialog}>
                        <CommentIcon />
                        <Typography variant='h5'>{post.comments.length}</Typography>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Add to BookMark">
                    <IconButton aria-label="add to Bookmark">
                        <BookmarkBorderOutlinedIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Share ">
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
            <Box sx={{ display: 'flex', ml: 2 }}>
                <Tooltip title="Add a comment">
                    <TextField
                        id="standard-basic"
                        multiline
                        rows={0}
                        variant="standard"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={handleCommentChange}
                        sx={{ border: 'none', outline: "none", width: '100%' }}
                    ></TextField>

                </Tooltip>
                <Button variant="text" color="primary" onClick={commentHandler} >
                    Post
                </Button>
            </Box>
            <Box>
                <CommentsDailog open={dialogOpen} setDialogOpen={setDialogOpen} />
            </Box>
            <Divider />
        </Card >
    );
}
