import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidbar from './Sidbar';
import { Box } from '@mui/material';

function MainLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <Sidbar 
        sx={{
          display: { xs: 'none', md: 'block' }, // Hide sidebar on small screens
          position: 'fixed', // Keep the sidebar fixed on larger screens
          width: '350px',
          height: '100vh', // Full height
          top: 0,
          left: 0,
          backgroundColor: 'background.paper',
          boxShadow: 3,
        }}
      />
      <Box 
        component="main"
        sx={{ 
          ml: { md: '350px' }, // Offset main content on larger screens
          p: 3, 
          flexGrow: 1, // Ensure the content area takes available space
          width: '100%', // Full width of the container
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
