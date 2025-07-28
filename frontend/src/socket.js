// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Eğer backend başka porttaysa burayı güncelle

export default socket;
