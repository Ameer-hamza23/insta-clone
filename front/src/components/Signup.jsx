import { useState } from 'react';
import '@fontsource/roboto/500.css';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import axios from "axios";
import { toast, Toaster } from "react-hot-toast"; 
import { USER } from '../Api';
import { Link } from 'react-router-dom';

function Signup() {
    const [inputs, setInputs] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const inputHandler = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const { username, email, password, confirmPassword } = inputs;
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match"); // Correct usage of toast
            return;
        }
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }
        try {
            // Example API call (replace with your actual endpoint)
            const response = await axios.post(`${USER}/register`, { username, email, password });
            console.log(response.data);
            if(response.data.status){
                toast.success("Signup successful!");
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.error(error);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'ButtonFace',
                height: '100vh',
                padding: '16px', // Add padding to handle smaller screens
            }}
        >
            <Box
                component="form"
                onSubmit={submitHandler}
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '100%' }, // Ensures the input fields take full width of the parent container
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: 3,
                    backgroundColor: 'white',
                    maxWidth: '400px', // Set a maximum width for the form box
                    width: '100%', // Full width up to the maxWidth
                    boxSizing: 'border-box',
                }}
            >
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{ mb: 2, textAlign: 'center', fontFamily: 'roboto' }}
                >
                    Signup
                </Typography>

                <TextField
                    required
                    label="User Name"
                    type="text"
                    fullWidth
                    name="username"
                    onChange={inputHandler}
                    value={inputs.username}
                />

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

                <TextField
                    required
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    name="confirmPassword"
                    onChange={inputHandler}
                    value={inputs.confirmPassword}
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button variant="contained" color="primary" type="submit">
                        Sign Up
                    </Button>
                </Box>

                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mt: 2,
                        alignItems: 'center',
                        flexDirection: 'column', // Stack vertically on smaller screens
                    }}
                >
                    <Typography 
                        sx={{ color: "black", textAlign: 'center' }}  
                        component={Link} 
                        to='/login'
                    >
                        <CircularProgress color='inherit' sx={{ mr: 1 }}/>
                        I have an account
                    </Typography>
                </Box>
            </Box>

            {/* Add the Toaster component to display the toast notifications */}
            <Toaster />
        </div>
    );
}

export default Signup;
