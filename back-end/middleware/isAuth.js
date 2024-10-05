// import jwt from "jsonwebtoken";

// const isAuthenthicate = async (req, res, next) => {
//     try {
//         const token = req.cookies.token;

//         if (!token) {
//             return res.status(400).json({ status: false, message: "Token Not Available" })
//         }

//         const decode = jwt.verify(token, process.env.JWT_SECRET)

//         if (!decode) {
//             return res.status(200).json({ status: false, message: "Token Not Verify" })
//         }

//         req.id = decode.userId
//         next()

//     } catch (error) {
//         console.log(error);
//     }
// }

// export default isAuthenthicate;


import jwt from "jsonwebtoken";

const isAuthenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log(token)
        if (!token) {
            return res.status(401).json({ status: false, message: "Token Not Available" });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.id = decode.userId;
            next();
        } catch (error) {
            // Handle JWT errors specifically
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ status: false, message: "Token Expired" });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ status: false, message: "Invalid Token" });
            } else {
                throw error; // For any other errors, fall back to the outer catch block
            }
        }

    } catch (error) {
        console.error("Authentication Error: ", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export default isAuthenticate;

