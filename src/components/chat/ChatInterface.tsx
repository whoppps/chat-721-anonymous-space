
import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, ArrowRight, UserCircle2, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other';
  timestamp: Date;
  nickname?: string;
}

const generateRandomId = () => Math.random().toString(36).substring(2, 11);
const getRandomColor = () => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const ChatInterface = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(42);
  const [nickname, setNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [nicknameDialogOpen, setNicknameDialogOpen] = useState(false);
  const [tempNickname, setTempNickname] = useState('');
  const [userColor] = useState(getRandomColor());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
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
    }
    
    // Load nickname if exists
    const savedNickname = localStorage.getItem('userNickname');
    if (savedNickname) {
      setNickname(savedNickname);
    } else {
      // Ask for nickname on first visit
      setNicknameDialogOpen(true);
    }
  }, []);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Simulate connection to chat
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true);
      
      // Add welcome message if no messages exist
      if (messages.length === 0) {
        setMessages([
          {
            id: generateRandomId(),
            content: '欢迎来到721匿名聊天网！您现在可以开始聊天了。请记住尊重他人并遵守社区规则。',
            sender: 'other',
            timestamp: new Date(),
            nickname: '系统'
          }
        ]);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [messages.length]);
  
  // Simulate random user count changes
  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.random() > 0.5 ? 1 : -1;
      setOnlineUsers(prev => {
        const newCount = prev + change;
        return newCount > 10 ? newCount : 11; // Keep at least 11 users
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const newMessage: Message = {
      id: generateRandomId(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      nickname: nickname || '匿名用户'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    // Clear typing indicator if it exists
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    // Show others are typing
    setIsTyping(true);
    
    // Simulate response (for demo purposes)
    const typingTime = 1000 + Math.random() * 2000;
    const responseTime = typingTime + 1000 + Math.random() * 3000;
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      
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
      
      // Generate random nickname for "other" user
      const randomNicknames = ['思考者', '闲云', '微风', '山水', '星辰', '流云', '竹影', '月光', '清风', '雨滴'];
      const otherNickname = randomNicknames[Math.floor(Math.random() * randomNicknames.length)];
      
      const responseMessage: Message = {
        id: generateRandomId(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'other',
        timestamp: new Date(),
        nickname: otherNickname
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, responseTime);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const saveNickname = () => {
    const newNickname = tempNickname.trim();
    if (newNickname) {
      setNickname(newNickname);
      localStorage.setItem('userNickname', newNickname);
      toast({
        title: "昵称已更新",
        description: `您的新昵称是: ${newNickname}`,
      });
    }
    setNicknameDialogOpen(false);
    setIsEditingNickname(false);
  };
  
  const handleClearChat = () => {
    if (confirm('确定要清空所有聊天记录吗？')) {
      setMessages([]);
      localStorage.removeItem('chatMessages');
      toast({
        title: "聊天记录已清空",
        description: "所有聊天记录已被删除。",
      });
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
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsEditingNickname(true)}
            className="flex items-center text-sm hover:underline"
          >
            <span className="hidden sm:inline mr-1">当前昵称:</span> 
            <span className="font-medium">{nickname || '匿名用户'}</span>
            <Edit className="h-3 w-3 ml-1" />
          </button>
          <button 
            onClick={handleClearChat} 
            className="text-sm text-muted-foreground hover:text-destructive"
          >
            清空聊天
          </button>
          <p className="text-sm">
            <span className="hidden sm:inline">在线用户:</span> <span className="font-medium">{onlineUsers}</span>
          </p>
        </div>
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
              {message.nickname && (
                <span className="text-xs text-muted-foreground mb-1">
                  {message.nickname}
                </span>
              )}
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
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center ml-2 mt-1 flex-shrink-0", userColor)}>
                <UserCircle2 className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex max-w-[80%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center mr-2 mt-1 flex-shrink-0">
              <UserCircle2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">有人正在输入...</span>
              <div className="bg-accent text-accent-foreground rounded-2xl rounded-tl-none p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground/70 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground/70 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" className="rounded-full flex-shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full flex-shrink-0">
            <Smile className="h-5 w-5" />
          </Button>
          <div className="flex-grow relative">
            <Input
              value={inputValue}
              onChange={handleInputChange}
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
      
      {/* Nickname Dialog */}
      <Dialog open={nicknameDialogOpen || isEditingNickname} onOpenChange={val => {
        if (!val && !nickname) {
          // Don't allow closing if no nickname set initially
          if (nicknameDialogOpen) return;
        }
        setNicknameDialogOpen(val);
        setIsEditingNickname(val);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{nickname ? '修改昵称' : '设置昵称'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="输入您想使用的昵称"
              value={tempNickname}
              onChange={(e) => setTempNickname(e.target.value)}
              className="mb-2"
              autoFocus
            />
            <p className="text-sm text-muted-foreground">
              昵称将显示在您的消息旁边，让其他用户能够识别您的消息。
            </p>
          </div>
          <DialogFooter>
            {nickname && (
              <Button variant="outline" onClick={() => {
                setIsEditingNickname(false);
                setNicknameDialogOpen(false);
              }}>
                取消
              </Button>
            )}
            <Button 
              onClick={saveNickname} 
              disabled={!tempNickname.trim()}
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
