import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { POST } from '../Api';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from '../redux/PostSlice';

export default function CreatePost({ open, setOpen }) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const imageRef = useRef();
    const dispatch = useDispatch();
    const { posts } = useSelector(store => store.post);

    const handleClose = () => {
        setOpen(false);
    };

    const handleImageUpload = () => {
        imageRef.current.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('caption', caption);
        if (image) formData.append('image', image);

        try {
            const res = await axios.post(`${POST}/addPost`, formData, { withCredentials: true });
            if (res.data.status) {
                toast.success(res.data.message);
                dispatch(setPost([res.data.post, ...posts]));
                setCaption('');
                setImage(null);
                setOpen(false); // Close the dialog after successful post
            }
        } catch (error) {
            console.error('Error:', error.response?.data?.message);
            toast.error('Failed to create post');
        }
    };

    return (
        <Box width='100%'>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                maxWidth='md'  // Set a responsive maxWidth
                fullWidth      // Full width for better responsiveness
            >
                <DialogTitle>Create A New Post</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <TextField
                            id="caption"
                            multiline
                            rows={1}
                            variant="standard"
                            placeholder="Add a Caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            sx={{ width: '100%', mb: 2 }}  // Ensure full width and margin-bottom
                        />
                    </FormControl>

                    {image && (
                        <Box
                            component="img"
                            src={URL.createObjectURL(image)}
                            alt="Selected Image"
                            onClick={handleImageUpload}
                            sx={{
                                display: 'block',
                                marginTop: 2,
                                width: {
                                    xs: '100%',  // Full width on small screens
                                    sm: '500px', // Max width on larger screens
                                },
                                height: 'auto',
                                cursor: 'pointer',
                                borderRadius: '8px',
                            }}
                        />
                    )}

                    {!image && (
                        <Box
                            onClick={handleImageUpload}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 2,
                                width: {
                                    xs: '100%',  // Full width on small screens
                                    sm: '500px', // Fixed width on larger screens
                                },
                                height: '200px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                color: '#999',
                                textAlign: 'center',
                            }}
                        >
                            Click here to upload an image
                        </Box>
                    )}

                    <input
                        type='file'
                        ref={imageRef}
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />

                    <Button
                        variant='contained'
                        fullWidth
                        onClick={handleSubmitPost}
                        sx={{
                            marginTop: 2,     // Margin for better spacing
                            padding: {
                                xs: '10px',  // Smaller padding for small screens
                                sm: '12px',  // Larger padding for bigger screens
                            },
                        }}
                    >
                        Post
                    </Button>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
