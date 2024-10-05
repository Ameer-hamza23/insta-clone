// import {v2 as cloudinary} from "cloudinary";
// import dotenv from "dotenv"

// dotenv.config();

// cloudinary.config({
//     CLOUD_NAME: process.env.CLOUD_NAME,
//     API_KEY : process.env.API_KEY,
//     API_SECRET : process.env.API_SECRET
// })

// export default cloudinary;

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,  // Use lowercase 'cloud_name'
    api_key: process.env.API_KEY,        // Use lowercase 'api_key'
    api_secret: process.env.API_SECRET   // Use lowercase 'api_secret'
});

export default cloudinary;
