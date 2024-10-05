import { Avatar, Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import React from 'react';

function Comment({ comment }) {
  return (
    <Card 
      sx={{
        width: {
          xs: '100%',  // Full width on extra-small screens
          sm: '90%',   // Slightly less than full width on small screens
          md: '75%',   // 75% width on medium screens
          lg: '60%',   // 60% width on large screens
          xl: '50%',   // 50% width on extra-large screens
        },
        mx: 'auto',     // Center horizontally
        mb: 2,          // Margin bottom for spacing between comments
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'red[500]' }} aria-label="recipe" src={comment.author.profilePicture}>
            R
          </Avatar>
        }
        title={comment.author.username}
        subheader={new Date(comment.createdAt).toLocaleString()} // Format the date
        sx={{ 
          '.MuiCardHeader-content': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }
        }} // Ensure text doesn't overflow
      />
      <CardContent>
        <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>
          {comment.text}
        </Typography>
      </CardContent>
      <Divider />
    </Card>
  );
}

export default Comment;
