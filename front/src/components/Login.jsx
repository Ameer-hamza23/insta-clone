import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { USER } from '../Api';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/AuthSlice.js';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [inputs, setInputs] = useState({
        email: '',
        password: '',
    });

    const inputHandler = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const { email, password } = inputs;
        try {
            const res = await axios.post(`${USER}/login`, { email, password }, { withCredentials: true });
            if (res.data.status) {
                dispatch(setAuthUser(res.data.user));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'ButtonFace',
                height: '100vh',
                padding: 2, // Added padding for responsiveness
            }}
        >
            <Box
                component="form"
                onSubmit={submitHandler}
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '100%' },
                    padding: { xs: '16px', sm: '20px' }, // Responsive padding
                    borderRadius: '8px',
                    boxShadow: 3,
                    backgroundColor: 'white',
                    maxWidth: '400px', // Responsive max width
                    width: '100%',
                }}
            >
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        mb: 2,
                        textAlign: 'center',
                        fontFamily: 'roboto',
                        fontSize: { xs: '1.5rem', sm: '1.75rem' }, // Responsive font size
                    }}
                >
                    Login
                </Typography>

                <TextField
                    required
                    label="Email"
                    type="email"
                    fullWidth
                    name="email"
                    onChange={inputHandler}
                    value={inputs.email}
                />

                <TextField
                    required
                    label="Password"
                    type="password"
                    fullWidth
                    name="password"
                    onChange={inputHandler}
                    value={inputs.password}
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button variant="contained" color="primary" type="submit">
                        Login
                    </Button>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 2,
                        '&:hover': {
                            color: 'red',
                            textDecoration: 'underline',
                            textDecorationColor: 'ActiveBorder'
                        }
                    }}
                >
                    <Typography
                        sx={{ color: 'black' }}
                        component={Link}
                        to='/signup'
                    >
                        I have no Account
                    </Typography>
                </Box>
            </Box>

            <Toaster />
        </Box>
    );
}
