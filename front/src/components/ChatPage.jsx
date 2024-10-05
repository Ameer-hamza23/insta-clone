import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import MessageIcon from '@mui/icons-material/Message';
import axios from 'axios';
import { setSelectedUser } from '../redux/AuthSlice.js';
import { setMessages } from '../redux/ChatSlice.js';
import Messages from './Message.jsx';
import { MESSAGE } from '../Api.js';
import { toast } from 'react-hot-toast';

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const { user, suggestedUser, selectedUser } = useSelector(store => store.auth);
  const { onlineUsers, messages } = useSelector(store => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    setLoading(true);
    try {
      const res = await axios.post(`${MESSAGE}/send/${receiverId}`, { message: textMessage }, {
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage('');
      }
    } catch (error) {
      toast.error('Failed to send the message.');
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  return (
    <div className='flex ml-[16%] h-screen'>
      <section className='w-full md:w-1/4 my-8'>
        <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
        <Divider className='mb-4' />
        <List className='overflow-y-auto h-[80vh]'>
          {suggestedUser.length === 0 ? (
            <ListItem>
              <ListItemText primary="No users available." />
            </ListItem>
          ) : (
            suggestedUser.map(suggestedUser => {
              const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(suggestedUser?._id); // Ensure onlineUsers is an array
              return (
                <ListItem button key={suggestedUser._id} onClick={() => dispatch(setSelectedUser(suggestedUser))}>
                  <ListItemAvatar>
                    <Avatar src={suggestedUser?.profilePicture} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={suggestedUser?.username}
                    secondary={isOnline ? 'online' : 'offline'}
                    secondaryTypographyProps={{ color: isOnline ? 'success.main' : 'error.main' }}
                  />
                </ListItem>
              );
            })
          )}
        </List>

      </section>

      {selectedUser ? (
        <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
          <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10'>
            <Avatar src={selectedUser?.profilePicture} alt='profile' />
            <div className='flex flex-col'>
              <span>{selectedUser?.username}</span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className='flex items-center p-4 border-t border-t-gray-300'>
            <TextField
              value={textMessage}
              onChange={e => setTextMessage(e.target.value)}
              fullWidth
              placeholder="Messages..."
              variant="outlined"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendMessageHandler(selectedUser?._id);
                }
              }}
            />
            <Button
              onClick={() => sendMessageHandler(selectedUser?._id)}
              variant="contained"
              color="primary"
              style={{ marginLeft: '10px' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Send'}
            </Button>
          </div>
        </section>
      ) : (
        <div className='flex flex-col items-center justify-center mx-auto'>
          <MessageIcon style={{ fontSize: 100 }} />
          <h1>Your messages</h1>
          <span>Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
