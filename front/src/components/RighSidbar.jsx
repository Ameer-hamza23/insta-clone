import React from 'react';
import { Avatar, Box, Typography, IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import SuggestedUser from './SuggestedUser';

export default function RightSidebar() {
  const { user } = useSelector(store => store.auth);

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: '300px', md: '400px' }, // Responsive width
        height: '100vh', // Full height of the viewport
        position: { xs: 'relative', sm: 'fixed' }, // Make it relative on small screens
        right: 0,
        top: 0,
        bgcolor: 'background.paper', // Background color
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        mt: { xs: 0, sm: 5 }, // Margin top adjustment for smaller screens
        mr: { xs: 0, sm: 10 }, // Margin right adjustment for smaller screens
        overflowY: 'auto', // Allow scrolling if content overflows
      }}
    >
      {/* Row for Avatar and Username */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column', // Stack items vertically on small screens
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Avatar
          sx={{ width: 80, height: 80, mb: 1 }} // Margin bottom to separate avatar from username
          src={user?.profilePicture}
          alt={user?.username}
        />
        <Typography variant="h6" textAlign="center">{user?.username}</Typography>
      </Box>

      {/* Bio directly below Avatar */}
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 2 }}
      >
        {user?.bio}
      </Typography>

      {/* Suggested Users section */}
      <SuggestedUser />

      {/* Optional: Add any other items like settings or icons */}
      <IconButton aria-label="settings" sx={{ mt: 2 }}>
        {/* Add your icon here */}
      </IconButton>
    </Box>
  );
}
