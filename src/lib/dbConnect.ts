import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
        connection.isConnected = db.connections[0].readyState;

        // console.log(db)
        // console.log(db.connections);
        // console.log("Connected to DB");
    } catch (error) {
        console.log("Error in DB connection",error);
        process.exit(1);
    }
}

export default dbConnect;