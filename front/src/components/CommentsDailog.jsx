import { Avatar, Box, Dialog, DialogContent, IconButton, Card, CardHeader, CardMedia, CardContent, Typography, Button, Divider, TextField } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';
import { useSelector } from 'react-redux';
import Comment from './Comment';
import { red } from '@mui/material/colors';

export default function CommentsDialog({ open, setDialogOpen }) {
  const [comment, setComment] = React.useState('');
  const { selectedPost } = useSelector(store => store.post);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const commentSubmitHandler = (e) => {
    e.preventDefault();
    if (comment.trim() === '') {
      alert('Please enter a comment');
      return;
    }
    alert(`Comment submitted: ${comment}`);
    setComment(''); // Clear the input after submission
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <Box width="100%">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth="lg" // Set the dialog size based on the screen
        fullWidth
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',  // Stack the layout vertically on small screens
              md: 'row'      // Side-by-side layout for medium and larger screens
            },
            height: {
              xs: '100%',    // Full height on small screens
              md: 'auto'     // Auto height on medium and larger screens
            }
          }}
        >
          {/* Post Section */}
          <DialogContent sx={{ width: { xs: '100%', md: '50%' }, p: 2 }}>
            <Card sx={{ width: "100%", mb: 2 }}>
              <CardHeader
                avatar={
                  <Avatar
                    sx={{ bgcolor: red[500] }}
                    aria-label="recipe"
                    src={selectedPost?.author?.profilePicture}
                  >
                    R
                  </Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={selectedPost?.author?.username}
                subheader={new Date(selectedPost?.createdAt).toLocaleDateString()}
              />
              <CardMedia
                component="img"
                height="auto"
                image={selectedPost?.image}
                alt="Post image"
                sx={{ width: "100%", objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {selectedPost?.caption}
                </Typography>
              </CardContent>
            </Card>
          </DialogContent>

          {/* Comments Section */}
          <Box
            sx={{
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 64px)',
              padding: 2,
              width: { xs: '100%', md: '50%' },  // Full width on small screens, half on larger screens
              borderLeft: { md: 1 },              // Border left only on larger screens
              borderColor: 'divider',
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: red[500] }}
                  aria-label="recipe"
                  src={selectedPost?.author?.profilePicture}
                />
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={selectedPost?.author?.username}
              subheader={new Date(selectedPost?.createdAt).toLocaleDateString()}
            />
            <Divider />
            <DialogContent>
              <Typography>Bio: {selectedPost?.author?.bio}</Typography>
            </DialogContent>
            <Divider />

            {/* Display comments */}
            {selectedPost?.comments?.map((com) => (
              <Comment key={com._id} comment={com} />
            ))}

            {/* Comment Input */}
            <Box sx={{ display: 'flex', mt: 2 }}>
              <TextField
                id="comment-input"
                multiline
                variant="outlined"
                placeholder="Add a comment..."
                value={comment}
                onChange={handleCommentChange}
                sx={{ width: '100%', mr: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={commentSubmitHandler}
              >
                Post
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
