import { Avatar, Box, Button, Typography, CircularProgress } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'; // Ensure axios is imported if you're making API calls
import {Link} from "react-router-dom"

export default function SuggestedUser() {
  const { suggestedUser } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  // Local state to track follow/unfollow status for each user
  const [followState, setFollowState] = useState({});
  const [loading, setLoading] = useState(false); // For loading state

  useEffect(() => {
    // Initialize followState based on suggestedUser data if needed
    const initialFollowState = suggestedUser.reduce((acc, user) => {
      acc[user._id] = false; // Default to not followed
      return acc;
    }, {});
    setFollowState(initialFollowState);
  }, [suggestedUser]);

  const handleFollow = async (userId) => {
    try {
      setLoading(true);
      // Toggle follow/unfollow state
      const newFollowState = !followState[userId];
      setFollowState(prevState => ({
        ...prevState,
        [userId]: newFollowState,
      }));

      // API call to follow/unfollow the user
      await axios.post(`/api/follow/${userId}`, { action: newFollowState ? 'follow' : 'unfollow' });

      // Dispatch any necessary Redux actions or update state
      // dispatch(updateUserFollowState(userId, newFollowState)); // Example action

      setLoading(false);
    } catch (error) {
      setLoading(false);
      // Handle error
      console.error("Error following/unfollowing user:", error);
    }
  };

  return (

    <Box sx={{ mt: 2, width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Suggested Users For You
      </Typography>

      {suggestedUser?.map(user => (
        
          <Box
            key={user._id} // Unique key for each user
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2, // Margin bottom to space out suggested users
              justifyContent: 'space-between', // Space between user info and button
              width: '100%', // Ensure full width
            }}
          >
            <Link to={`/profile/${user._id}`}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{ width: 50, height: 50, mr: 2 }} // Smaller avatar size for suggested users
                src={user?.profilePicture || '/default-avatar.png'} // Fallback to a default image if missing
                alt={user?.username || 'User'}
              />
              <Typography variant="body1" sx={{ flexGrow: 1 }}>{user?.username || 'Anonymous'}</Typography> {/* Fallback for missing username */}
            </Box>
            </Link>

            <Button
              variant={followState[user._id] ? 'outlined' : 'contained'}
              color="primary"
              onClick={() => handleFollow(user._id)}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (followState[user._id] ? 'Unfollow' : 'Follow')}
            </Button>
          </Box>
       
      ))}
    </Box>
  );
}
