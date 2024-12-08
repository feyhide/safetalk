import { disconnect } from 'mongoose';
import {Server as SocketIoServer} from 'socket.io'

const setUpSocket = (server) => {
    const io = new SocketIoServer({
        cors:{
            origin:process.env.ORIGIN,
            methods:["GET","POST"],
            credentials: true
        }
    })

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`client disconnect: ${socket.id}`)
        for(const [userId,socketId] of userSocketMap.entries()){
            if(socketId === socket.id){
                userSocketMap.delete(userId)
                break;
            }
        }
    }

    io.on("connection",(socket)=>{
        const userId = socket.handshake.query.userId;
        if(userId){
            userSocketMap.set(userId,socket.id);
            console.log(`user connected: ${userId} with socketID: ${socket.id}`)
        }else{
            console.log("User id is not provided during connection")
        }

        socket.on("disconnect",()=>disconnect(socket))
    })
}


export default setUpSocket