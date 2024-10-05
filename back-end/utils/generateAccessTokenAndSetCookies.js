import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (res,userId)=>{
    try {
        const token = jwt.sign({userId},process.env.JWT_SECRET,{ expiresIn:"1d"})

        res.cookie('token',token,{
            httpOnly: true,
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        })

        return token;

    } catch (error) {
        console.log(`Error in Util Generate Token :: ${error}`)
    }
}

export default generateTokenAndSetCookie;