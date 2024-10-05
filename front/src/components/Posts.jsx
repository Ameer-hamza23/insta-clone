import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Box } from '@mui/material';
import Post from './Post';

const Posts = () => {
    const { posts } = useSelector((store) => store.post);

    return (
        <Box
            sx={{
                p: { xs: 1, sm: 2 }, // Responsive padding
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {posts.length > 0 ? (
                posts.map((post) => (
                    <Post key={post._id} post={post} />
                ))
            ) : (
                <Typography variant="h6" sx={{ mt: 2 }}>
                    No posts available
                </Typography>
            )}
        </Box>
    );
};

export default Posts;
