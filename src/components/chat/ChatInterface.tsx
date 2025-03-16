
import React, { useState, useRef, useEffect } from 'react';
import { Send, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage, saveMessage, getAllMessages, clearAllMessages, getNewerMessages } from '@/utils/chatStorage';

const POLLING_INTERVAL = 1000; // Poll every second for new messages

export const ChatInterface = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [nickname, setNickname] = useState('');
  const [nicknameDialogOpen, setNicknameDialogOpen] = useState(false);
  const [tempNickname, setTempNickname] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastPollTimeRef = useRef<Date>(new Date());
  
  // Generate a unique user color based on nickname
  const getUserColor = (name: string) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };
  
  // Load all messages initially, then poll for new ones
  const loadMessages = async () => {
    try {
      const currentTime = new Date();
      const newMessages = await getNewerMessages(lastPollTimeRef.current);
      
      if (newMessages.length > 0) {
        setMessages(prevMessages => {
          // Combine existing messages with new ones and sort
          const allMessages = [...prevMessages, ...newMessages];
          // Remove duplicates based on message id
          const uniqueMessages = Array.from(
            new Map(allMessages.map(msg => [msg.id, msg])).values()
          );
          // Sort by timestamp
          return uniqueMessages.sort(
            (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
          );
        });
      }
      
      lastPollTimeRef.current = currentTime;
    } catch (error) {
      console.error('Error loading messages:', error);
      setIsConnected(false);
    }
  };
  
  // Initial setup
  useEffect(() => {
    // Load nickname if exists
    const savedNickname = localStorage.getItem('userNickname');
    if (savedNickname) {
      setNickname(savedNickname);
    } else {
      // Ask for nickname on first visit
      setNicknameDialogOpen(true);
    }
    
    // Initial message load
    const initialLoad = async () => {
      try {
        const allMessages = await getAllMessages();
        setMessages(allMessages.sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        ));
        setIsConnected(true);
      } catch (error) {
        console.error('Error during initial message load:', error);
        setIsConnected(false);
      }
    };
    
    initialLoad();
    
    // Set up polling for new messages
    const interval = setInterval(() => {
      loadMessages();
    }, POLLING_INTERVAL);
    
    return () => clearInterval(interval);
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    if (!nickname) {
      setNicknameDialogOpen(true);
      return;
    }
    
    try {
      // Add user message
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content: inputValue,
        sender: 'user',
        timestamp: new Date(),
        nickname: nickname
      };
      
      // Save to IndexedDB
      await saveMessage(newMessage);
      
      // Optimistically add to UI
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Clear input
      setInputValue('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "发送失败",
        description: "无法发送消息，请重试",
        variant: "destructive"
      });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const saveNickname = () => {
    const newNickname = tempNickname.trim();
    if (newNickname) {
      setNickname(newNickname);
      localStorage.setItem('userNickname', newNickname);
      toast({
        title: "昵称已设置",
        description: `您的昵称是: ${newNickname}`,
      });
      setNicknameDialogOpen(false);
    }
  };
  
  const handleClearChat = async () => {
    if (confirm('确定要清空所有聊天记录吗？')) {
      await clearAllMessages();
      setMessages([]);
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
        <Button 
          onClick={() => setIsConnected(true)} 
          className="mt-4"
        >
          重试连接
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full h-[calc(100vh-200px)] rounded-xl border bg-card overflow-hidden flex flex-col">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <h3 className="font-medium">公共聊天室</h3>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setNicknameDialogOpen(true)}
            className="flex items-center text-sm hover:underline"
          >
            <span className="hidden sm:inline mr-1">当前昵称:</span> 
            <span className="font-medium">{nickname || '未设置'}</span>
          </button>
          <button 
            onClick={handleClearChat} 
            className="text-sm text-muted-foreground hover:text-destructive"
          >
            清空聊天
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.nickname === nickname;
          const userColor = getUserColor(message.nickname);
          
          return (
            <div 
              key={message.id}
              className={cn(
                "flex max-w-[80%]",
                isCurrentUser ? 'ml-auto' : 'mr-auto'
              )}
            >
              {!isCurrentUser && (
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0", userColor)}>
                  <UserCircle2 className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">
                  {message.nickname}
                </span>
                <div 
                  className={cn(
                    "rounded-2xl p-3",
                    isCurrentUser 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-accent text-accent-foreground rounded-tl-none"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              
              {isCurrentUser && (
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center ml-2 mt-1 flex-shrink-0", userColor)}>
                  <UserCircle2 className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          );
        })}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <div className="flex-grow relative">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息..."
              className="pr-12 min-h-[60px] resize-none"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={inputValue.trim() === ''}
              size="icon" 
              className="h-8 w-8 absolute right-3 bottom-3 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Nickname Dialog */}
      <Dialog 
        open={nicknameDialogOpen} 
        onOpenChange={(val) => {
          if (!val && nickname) {
            setNicknameDialogOpen(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>设置昵称</DialogTitle>
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
