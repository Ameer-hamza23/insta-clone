import React from 'react';
import { Feed } from './Feed';
import { Outlet } from 'react-router-dom';
import RighSidbar from './RighSidbar';
import { Box } from '@mui/material';
import getAllPost from '../hooks/getAllPost';
import getSuggestedUser from '../hooks/getSuggestedUser';

export const Home = () => {
    getAllPost();
    getSuggestedUser();
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }, // Stack items vertically on small screens and horizontally on larger screens
                gap: 2, // Adjusted gap for better spacing
                padding: 2,
                width: '100%', // Full width of the container
                boxSizing: 'border-box', // Ensure padding and borders are included in the width and height
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    maxWidth: { xs: '100%', md: '75%' }, // Full width on small screens, 75% on larger screens
                    flexBasis: 0,
                }}
            >
                <Feed />
            </Box>
            <Box
                sx={{
                    flex: 1,
                    maxWidth: { xs: '100%', md: '25%' }, // Full width on small screens, 25% on larger screens
                    flexBasis: 0,
                }}
            >
                <RighSidbar />
            </Box>
            <Box
                sx={{
                    width: '100%',
                    mt: 2, // Margin top for spacing
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
