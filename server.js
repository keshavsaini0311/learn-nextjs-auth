import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            socket.broadcast.to(roomId).emit('user-joined', socket.id);
        });

        socket.on('webrtc_offer', (roomId, offer, senderId) => {
            socket.to(roomId).emit('webrtc_offer', offer, senderId);
        });

        socket.on('webrtc_answer', (roomId, answer, senderId) => {
            socket.to(roomId).emit('webrtc_answer', answer, senderId);
        });

        socket.on('webrtc_ice_candidate', (roomId, candidate, senderId) => {
            socket.to(roomId).emit('webrtc_ice_candidate', candidate, senderId);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
