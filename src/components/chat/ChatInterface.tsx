
import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, ArrowRight, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

const generateRandomId = () => Math.random().toString(36).substring(2, 11);

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Simulate connection to chat
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true);
      
      // Add welcome message
      setMessages([
        {
          id: generateRandomId(),
          content: '欢迎来到721匿名聊天网！您现在可以开始聊天了。请记住尊重他人并遵守社区规则。',
          sender: 'other',
          timestamp: new Date()
        }
      ]);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const newMessage: Message = {
      id: generateRandomId(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    // Simulate response (for demo purposes)
    setTimeout(() => {
      const responses = [
        '您的想法很有趣！能分享更多吗？',
        '我理解您的观点，不过我有不同看法。',
        '谢谢分享！这让我想到了...',
        '这是个很好的话题，我们可以深入讨论。',
        '您提到的这点很重要，我也有类似的经历。'
      ];
      
      const responseMessage: Message = {
        id: generateRandomId(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'other',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000 + Math.random() * 2000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (!isConnected) {
    return (
      <div className="w-full h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">正在连接到聊天服务器...</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-[calc(100vh-200px)] rounded-xl border bg-card overflow-hidden flex flex-col">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <h3 className="font-medium">匿名聊天室</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          在线用户: 42
        </p>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={cn(
              "flex max-w-[80%] animate-slide-up",
              message.sender === 'user' ? 'ml-auto' : 'mr-auto'
            )}
          >
            {message.sender === 'other' && (
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <UserCircle2 className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            
            <div className="flex flex-col">
              <div 
                className={cn(
                  "rounded-2xl p-3",
                  message.sender === 'user' 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-accent text-accent-foreground rounded-tl-none"
                )}
              >
                <p>{message.content}</p>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {formatTime(message.timestamp)}
              </span>
            </div>
            
            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ml-2 mt-1 flex-shrink-0">
                <UserCircle2 className="w-5 h-5 text-primary" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" className="rounded-full flex-shrink-0">
            <PaperClip className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full flex-shrink-0">
            <Smile className="h-5 w-5" />
          </Button>
          <div className="flex-grow relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息..."
              className="pr-12 rounded-full"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={inputValue.trim() === ''}
              size="icon" 
              className="h-8 w-8 absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
