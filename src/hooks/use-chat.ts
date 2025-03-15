
import { useState, useEffect, useRef } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'other';
  timestamp: Date;
  nickname?: string;
}

interface UseChatOptions {
  roomId: string;
  initialMessages?: ChatMessage[];
  onNewMessage?: (message: ChatMessage) => void;
}

export const useChat = ({ roomId, initialMessages = [], onNewMessage }: UseChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(Math.floor(Math.random() * 50) + 10);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load messages for this room from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_room_${roomId}`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error parsing saved messages:', error);
      }
    } else if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
    
    // Simulate random user count changes for this room
    const interval = setInterval(() => {
      const change = Math.random() > 0.7 ? Math.floor(Math.random() * 3) - 1 : 0;
      setOnlineUsers(prev => {
        const newCount = prev + change;
        return newCount > 5 ? newCount : 6; // Keep at least 6 users
      });
    }, 15000);
    
    return () => {
      clearInterval(interval);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [roomId, initialMessages]);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`chat_room_${roomId}`, JSON.stringify(messages));
  }, [messages, roomId]);
  
  const sendMessage = (content: string, nickname?: string) => {
    if (!content.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 11),
      content,
      sender: 'user',
      timestamp: new Date(),
      nickname
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Notify parent component
    if (onNewMessage) {
      onNewMessage(newMessage);
    }
    
    // Simulate typing indicator
    setIsTyping(true);
    
    // Simulate response
    const typingTime = 1000 + Math.random() * 3000;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      
      // Only respond sometimes (80% chance)
      if (Math.random() > 0.2) {
        const responses = [
          '您的想法很有趣！能分享更多吗？',
          '我理解您的观点，不过我有不同看法。',
          '谢谢分享！这让我想到了...',
          '这是个很好的话题，我们可以深入讨论。',
          '您提到的这点很重要，我也有类似的经历。',
          '这个观点值得思考，让我们继续讨论。',
          '我没想到这个角度，很有启发性。',
          '您说得对，我完全同意您的看法。',
          '这个问题确实很复杂，有很多方面需要考虑。',
          '您能举个例子来说明吗？我想更好地理解您的观点。'
        ];
        
        // Random nickname for other users
        const randomNicknames = ['思考者', '闲云', '微风', '山水', '星辰', '流云', '竹影', '月光', '清风', '雨滴'];
        const otherNickname = randomNicknames[Math.floor(Math.random() * randomNicknames.length)];
        
        const responseMessage: ChatMessage = {
          id: Math.random().toString(36).substring(2, 11),
          content: responses[Math.floor(Math.random() * responses.length)],
          sender: 'other',
          timestamp: new Date(),
          nickname: otherNickname
        };
        
        setMessages(prev => [...prev, responseMessage]);
        
        // Notify parent component
        if (onNewMessage) {
          onNewMessage(responseMessage);
        }
      }
    }, typingTime);
  };
  
  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem(`chat_room_${roomId}`);
  };
  
  return {
    messages,
    sendMessage,
    clearMessages,
    isTyping,
    onlineUsers
  };
};
