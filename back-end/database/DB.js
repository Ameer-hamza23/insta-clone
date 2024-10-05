import mongoose from "mongoose";

const databaseConnection = async ()=>{
    try {
        const con = mongoose.connect(`${process.env.MONGO_DB_URI}`)
        // console.log(con.c)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
     
}

export default databaseConnection;