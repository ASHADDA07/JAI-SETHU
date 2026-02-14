import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

// Define the shape of our context
interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[]; // We can add this feature later
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// The Provider Component
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (currentUser) {
      // 1. Connect to Backend
      const newSocket = io('http://localhost:3000'); 

      // 2. Join my private room (so people can message me)
      newSocket.emit('joinRoom', currentUser.id);

      setSocket(newSocket);

      // 3. Cleanup on logout/unmount
      return () => {
        newSocket.close();
      };
    } else {
      // If user logs out, close socket
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [currentUser]); // Re-run if user changes

  return (
    <SocketContext.Provider value={{ socket, onlineUsers: [] }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom Hook to use the socket anywhere
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};