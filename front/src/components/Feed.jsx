import React from 'react';
import Posts from './Posts';
import { Box } from '@mui/material';

export const Feed = () => {
  return (
    <Box
      sx={{
        flexGrow: 1, // Ensure the feed takes up available space
        p: {
          xs: 1,  // Smaller padding on extra small screens
          sm: 2,  // Medium padding on small screens and up
          md: 3,  // Larger padding on medium screens and up
        },
        width: '100%', // Full width of the container
        overflowY: 'auto', // Allow scrolling if content overflows
        maxWidth: '100%', // Ensure it does not exceed the container's width
        height: '100vh', // Ensure it takes up full viewport height
      }}
    >
      <Posts />
    </Box>
  );
};
