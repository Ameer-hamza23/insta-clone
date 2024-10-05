// import express from "express";
// import dotenv from "dotenv";
// import route from "./routes/user_routes.js";
// import cookieParser from "cookie-parser";
// import post_route from './routes/post_route.js';
// import message_route from './routes/message_route.js';
// import cors from "cors";
// import { server, app } from "./socket/socket.js";

// dotenv.config(); // Load environment variables

// // Configure CORS to allow credentials (cookies)
// app.use(cors({
//     origin: 'http://localhost:3000', // Update this as needed
//     credentials: true, // Allows cookies to be sent
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Routes
// app.use('/api/v1', route);
// app.use('/api/v1/post', post_route);
// app.use('/api/v1/message', message_route);

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });

// import databaseConnection from "./database/DB.js";

// databaseConnection();

// server.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });
