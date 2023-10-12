import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import keys from "./config/keys";

function ChatApp() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    if (!socket) {
      const newSocket = io(keys.BACKEND_URL);
      setSocket(newSocket);

      newSocket.on("receive-message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }
  }, [socket]);

  const handleJoinRoom = () => {
    if (username && room) {
      socket?.emit("join-room", room, username);
    }
  };

  const handleSendMessage = () => {
    if (message && room) {
      socket?.emit("send-message", room, `${username}: ${message}`);
      setMessage("");
    }
  };

  const handleCreateRoom = () => {
    if (username && room) {
      socket?.emit("create-room", room, username);
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room Name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>
      <div>
        <div>
          <h3>Chat Messages</h3>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
        </div>
        <div>
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
