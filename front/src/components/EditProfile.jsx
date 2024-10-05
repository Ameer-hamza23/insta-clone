import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Button, Typography, TextField, MenuItem, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { setAuthUser } from '../redux/AuthSlice';
import { USER } from '../Api';

const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePicture: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    });
    const [preview, setPreview] = useState(input.profilePicture);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Update preview when profilePicture changes
        if (input.profilePicture instanceof File) {
            setPreview(URL.createObjectURL(input.profilePicture));
        } else {
            setPreview(input.profilePicture);
        }
    }, [input.profilePicture]);

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, profilePicture: file });
        }
    };

    const selectChangeHandler = (event) => {
        setInput({ ...input, gender: event.target.value });
    };

    const editProfileHandler = async () => {
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        if (input.profilePicture) {
            formData.append("profilePicture", input.profilePicture);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER}/editProfile`, formData, { // Corrected URL
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.status) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user?.gender
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box display="flex" justifyContent="center" p={3}>
            <Box maxWidth="600px" width="100%">
                <Typography variant="h5" gutterBottom>
                    Edit Profile
                </Typography>
                <Box display="flex" alignItems="center" mb={3}>
                    <Avatar
                        src={preview}
                        sx={{ width: 100, height: 100 }}
                    >
                        {user?.username?.charAt(0) || 'U'}
                    </Avatar>
                    <Button
                        variant="contained"
                        onClick={() => imageRef.current.click()}
                        sx={{ ml: 2 }}
                    >
                        Change Photo
                    </Button>
                    <input
                        ref={imageRef}
                        type="file"
                        onChange={fileChangeHandler}
                        hidden
                    />
                </Box>
                <Box mb={3}>
                    <Typography variant="h6">Bio</Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={input.bio}
                        onChange={(e) => setInput({ ...input, bio: e.target.value })}
                    />
                </Box>
                <Box mb={3}>
                    <Typography variant="h6">Gender</Typography>
                    <TextField
                        select
                        fullWidth
                        label="Gender"
                        value={input.gender}
                        onChange={selectChangeHandler}
                        variant="outlined"
                    >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Femail">Female</MenuItem>
                    </TextField>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    {loading ? (
                        <Button variant="contained" disabled>
                            <CircularProgress size={24} sx={{ mr: 2 }} />
                            Please wait
                        </Button>
                    ) : (
                        <Button variant="contained" onClick={editProfileHandler}>
                            Submit
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default EditProfile;
