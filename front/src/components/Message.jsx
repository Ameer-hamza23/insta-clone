import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllMessage from '../hooks/useGetAllMessages.js';
import useGetRTM from '../hooks/useGetRTM';
import { Box, Typography } from '@mui/material';

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);

    return (
        <Box className='overflow-y-auto flex-1 p-4'>
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mb={2}>
                <Avatar
                    alt={selectedUser?.username}
                    src={selectedUser?.profilePicture}
                    sx={{ width: 80, height: 80 }}
                />
                <Typography variant="h6" component="span" sx={{ mt: 1 }}>
                    {selectedUser?.username}
                </Typography>
                <Link to={`/profile/${selectedUser?._id}`}>
                    <Button variant="outlined" sx={{ mt: 2 }}>View Profile</Button>
                </Link>
            </Box>
            <Box display="flex" flexDirection="column" gap={2}>
                {
                    messages && messages.map((msg) => {
                        const isSender = msg.senderId === user?._id;
                        return (
                            <Box
                                key={msg._id}
                                display="flex"
                                justifyContent={isSender ? 'flex-end' : 'flex-start'}
                            >
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        maxWidth: '60%',
                                        wordBreak: 'break-word',
                                        bgcolor: isSender ? 'primary.main' : 'grey.300',
                                        color: isSender ? 'primary.contrastText' : 'text.primary'
                                    }}
                                >
                                    {msg.message}
                                </Box>
                            </Box>
                        );
                    })
                }
            </Box>
        </Box>
    );
}

export default Messages;
