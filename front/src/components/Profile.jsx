import React, { useState } from 'react';
import { Avatar, Box, Button, Typography, Grid, ImageListItem, IconButton } from '@mui/material';
import { red } from '@mui/material/colors';
import { Heart, MessageCircle } from 'lucide-react';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const Profile = () => {
  const params = useParams();
  const userId = params.id;

  useGetUserProfile(userId);

  const { selectedProfileUser, user} = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState('posts');

  const isLoggedInUser = selectedProfileUser._id === user._id;
  const isFollowing = false;

  const tabChangeHandler = (tab) => {
    setActiveTab(tab);
  };

  // Get the appropriate tab's contents
  const selectedTabContents = activeTab === 'posts' ? selectedProfileUser?.posts : selectedProfileUser?.bookmarks;

  return (
    <Box>
      {/* Profile Information */}
      <Grid container spacing={3} justifyContent="center" alignItems="center" pb={4}>
        {/* Avatar */}
        <Grid item xs={12} md={4} display="flex" justifyContent="center">
          <Avatar
            sx={{ bgcolor: red[500], width: 128, height: 128 }}
            src={selectedProfileUser?.profilePicture}
            alt={selectedProfileUser?.username}
          >
            {selectedProfileUser?.username?.charAt(0) || 'R'}
          </Avatar>
        </Grid>

        {/* Username and Buttons */}
        <Grid item xs={12} md={8}>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Typography variant="h4" sx={{ mr: 2 }}>
              {selectedProfileUser?.username}
            </Typography>

            {isLoggedInUser ? (
              <Box display="flex" gap={2}>
                <Link to={'/account/editprofile'}><Button variant="outlined">Edit Profile</Button></Link>
                <Button variant="contained">Archive</Button>
                <Button variant="contained">Add Tool</Button>
              </Box>
            ) : (
              <Box display="flex" gap={2}>
                {isFollowing ? (
                  <>
                    <Button variant="contained">Following</Button>
                    <Button variant="contained">Message</Button>
                  </>
                ) : (
                  <Button variant="contained">Follow</Button>
                )}
              </Box>
            )}
          </Box>

          {/* Posts, Followers, Following Count */}
          <Box display="flex" gap={2} mt={2}>
            <Typography>{selectedProfileUser?.posts?.length || 0} Posts</Typography>
            <Typography>{selectedProfileUser?.followers?.length || 0} Followers</Typography>
            <Typography>{selectedProfileUser?.following?.length || 0} Following</Typography>
          </Box>
          <Box>
            <Typography>{selectedProfileUser.bio}</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Tab Navigation */}
      <Grid container justifyContent="center" borderTop={2} py={2}>
        <Box display="flex" gap={4}>
          <Button onClick={() => tabChangeHandler('posts')}>Posts</Button>
          <Button onClick={() => tabChangeHandler('saved')}>Saved</Button>
          <Button>Reels</Button>
          <Button>Tags</Button>
        </Box>
      </Grid>

      {/* Display Posts or Bookmarks */}
      <Grid container spacing={2} mt={4}>
        {selectedTabContents?.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post?._id}>
            <Box
              position="relative"
              className="hover-effect"
              sx={{
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover .hover-content': {
                  opacity: 1,
                },
              }}
            >
              <img
                src={post?.image}
                alt="postimage"
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
              <Box
                className="hover-content"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  opacity: 0,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              >
                <Box display="flex" gap={2}>
                  <IconButton sx={{ color: 'white' }}>
                    <Heart />
                    <Typography sx={{ ml: 1 }}>{post?.likes?.length || 0}</Typography>
                  </IconButton>
                  <IconButton sx={{ color: 'white' }}>
                    <MessageCircle />
                    <Typography sx={{ ml: 1 }}>{post?.comments?.length || 0}</Typography>
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Profile;
