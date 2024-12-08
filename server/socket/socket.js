import { disconnect } from 'mongoose';
import {Server as SocketIoServer} from 'socket.io'

const setUpSocket = (server) => {
    console.log("CORS origin is: ", process.env.ORIGIN);

    const io = new SocketIoServer(server, {
        cors: {
            origin: process.env.ORIGIN, 
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ["websocket", "polling"], 
    });

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

    const sendMessage = async(message) => {
        console.log(message)
        const senderSocketId = userSocketMap.get(message.sender)
        const recipientSocketId = userSocketMap.get(message.recipient)
        
        if(recipientSocketId){
            console.log("send to re")
            io.to(recipientSocketId).emit("receivedMessage",message)
        }
        if(senderSocketId){
            console.log("send to se")
            io.to(senderSocketId).emit("receivedMessage",message)
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


        socket.on("sendMessage",sendMessage)
        socket.on("disconnect",()=>disconnect(socket))
    })
}


export default setUpSocket