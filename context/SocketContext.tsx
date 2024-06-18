import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: any[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const useSocketContext = () => {
  return useContext(SocketContext);
};

interface SocketContextProviderProps {
  children: ReactNode;
}

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [authUser, setAuthUser] = useState<any>(null);

  useEffect(() => {
    const fetchAuthUser = async () => {
      const storedUser = await AsyncStorage.getItem('chat-user');
      if (storedUser) {
        setAuthUser(JSON.parse(storedUser));
      }
    };

    fetchAuthUser();
  }, []);

  useEffect(() => {
    if (authUser) {
      const newSocket = io("https://wavoo.onrender.com/", {
        query: { userId: authUser._id },
      });
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users: any[]) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
