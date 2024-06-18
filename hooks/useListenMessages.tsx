import React, { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import Sound from 'react-native-sound';
import notificationSound from '../assets/sounds/notification.mp3';

interface Message {
  id: string;
  text: string;
  shouldShake?: boolean;
  [key: string]: any;
}

interface UseListenMessagesProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const useListenMessages = ({ messages, setMessages }: UseListenMessagesProps) => {
  const { socket } = useSocketContext();

  useEffect(() => {
    const sound = new Sound(notificationSound, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
    });

    const handleNewMessage = (newMessage: Message) => {
      newMessage.shouldShake = true;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setTimeout(()=>
      {
        sound.play();
      },1000)

    };

    socket?.on('newMessage', handleNewMessage);

    return () => {
      socket?.off('newMessage', handleNewMessage);
      sound.release();
    };
  }, [socket, setMessages]);

  return { messages, setMessages };
};

export default useListenMessages;
