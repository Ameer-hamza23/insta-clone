import React, { useState } from 'react';
import { HiHome } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { MdOutlineExplore } from "react-icons/md";
import { SiImessage } from "react-icons/si";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoCreateOutline } from "react-icons/io5";
import Avatar from '@mui/material/Avatar';
import { CiLogout } from "react-icons/ci";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { USER } from '../Api';
import { toast } from "react-hot-toast";  // Ensure this is installed
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/AuthSlice';
import CreatePost from './CreatePost';  // Ensure this component is defined

export default function Sidebar() {

    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [createDialog, setCreateDialog] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const itemsSidebar = [
        { icon: <HiHome />, text: "Home", path: '/' },
        { icon: <CiSearch />, text: "Search", path: '/search' },
        { icon: <MdOutlineExplore />, text: "Explore", path: '/explore' },
        { icon: <SiImessage />, text: "Messages", path: '/chat' },
        { icon: <IoIosNotificationsOutline />, text: "Notifications", path: '/notification' },
        { icon: <IoCreateOutline />, text: "Create", },
        { icon: <Avatar alt={user?.username} src={user?.profilePicture || "/default-avatar.png"} sx={{ width: 40, height: 40 }} />, text: "Profile", path: '/profile' },
        { icon: <CiLogout />, text: "Logout", },
    ];

    const logoutHandler = async () => {
        try {
            const res = await axios.post(`${USER}/logout`, {}, { withCredentials: true });
            if (res.data.status) {
                navigate('/login');
                dispatch(setAuthUser(null));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed. Please try again.");
        }
    };

    const itemClickHandler = (item) => {
        if (item.text === 'Logout') {
            logoutHandler();
        } else if (item.text === 'Create') {
            setCreateDialog(true);
        } else if (item.text === 'Profile') {
            user && navigate(`/profile/${user._id}`);
        } else {
            navigate(item.path);
        }
    };

    const drawer = (
        <List sx={{ borderRight: 2, height: "100%" }}>
            {itemsSidebar.map((item, index) => (
                <ListItem key={index} disablePadding onClick={() => itemClickHandler(item)}>
                    <ListItemButton
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            padding: '10px 20px',
                            borderRadius: '30px',
                            backgroundColor: location.pathname === item.path ? '#e0f7fa' : 'inherit',
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: '40px', color: '#000', fontSize: 32 }}>
                            {item.icon}
                        </ListItemIcon>
                        {!isMobile && (
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    color: '#000',
                                }}
                                sx={{ ml: 2 }}
                            />
                        )}
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );

    return (
        <div style={{ borderRight: 2 }}>
            <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { xs: 'block', sm: 'none' }, ml: 2 }}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={isMobile ? mobileOpen : true}
                onClose={handleDrawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: isMobile ? '75%' : '250px',
                        backgroundColor: '#fff',
                        paddingTop: '10px',
                        boxSizing: 'border-box',
                        borderRight: 'none',
                    },
                }}
            >
                <Toolbar />
                {drawer}
            </Drawer>
            <CreatePost open={createDialog} setOpen={setCreateDialog} />
        </div>
    );
}
