
import React, { useState, useEffect } from 'react';
import { Search, Users, Settings, ChevronDown, Plus, Hash, Trash, ArrowRight, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface ChatRoom {
  id: string;
  name: string;
  participants: number;
  category: string;
  description?: string;
}

const INITIAL_CHAT_ROOMS: ChatRoom[] = [
  { id: '1', name: '日常交流', participants: 42, category: '普通', description: '讨论任何日常话题的地方。' },
  { id: '2', name: '音乐爱好者', participants: 28, category: '兴趣', description: '分享你喜欢的音乐和艺术家。' },
  { id: '3', name: '电影讨论', participants: 35, category: '兴趣', description: '讨论最新的电影和经典作品。' },
  { id: '4', name: '科技新闻', participants: 19, category: '新闻', description: '分享和讨论最新科技动态。' },
  { id: '5', name: '游戏玩家', participants: 64, category: '兴趣', description: '讨论所有游戏相关的话题。' },
  { id: '6', name: '美食分享', participants: 31, category: '生活', description: '分享美食体验和烹饪技巧。' },
  { id: '7', name: '旅行故事', participants: 24, category: '生活', description: '分享旅行经历和建议。' },
  { id: '8', name: '职场交流', participants: 37, category: '职业', description: '讨论职场问题和经验。' },
];

interface Category {
  name: string;
  isOpen: boolean;
}

export const ChatSidebar = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState('1');
  const [createRoomDialogOpen, setCreateRoomDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCategory, setNewRoomCategory] = useState('普通');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [categories, setCategories] = useState<Category[]>([
    { name: '普通', isOpen: true },
    { name: '兴趣', isOpen: true },
    { name: '新闻', isOpen: true },
    { name: '生活', isOpen: true },
    { name: '职业', isOpen: true },
    { name: '自定义', isOpen: true },
  ]);
  
  // Load chat rooms from local storage or use initial data
  useEffect(() => {
    const savedRooms = localStorage.getItem('chatRooms');
    if (savedRooms) {
      try {
        setChatRooms(JSON.parse(savedRooms));
      } catch (error) {
        console.error('Error parsing saved rooms:', error);
        setChatRooms(INITIAL_CHAT_ROOMS);
      }
    } else {
      setChatRooms(INITIAL_CHAT_ROOMS);
    }
    
    // Load active room from local storage
    const savedActiveRoom = localStorage.getItem('activeRoomId');
    if (savedActiveRoom) {
      setActiveRoomId(savedActiveRoom);
    }
  }, []);
  
  // Save chat rooms to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('chatRooms', JSON.stringify(chatRooms));
  }, [chatRooms]);
  
  // Save active room to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeRoomId', activeRoomId);
  }, [activeRoomId]);
  
  const toggleCategory = (categoryName: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.name === categoryName 
          ? { ...cat, isOpen: !cat.isOpen } 
          : cat
      )
    );
  };
  
  const handleCreateRoom = () => {
    if (!newRoomName.trim()) {
      toast({
        title: "错误",
        description: "请输入聊天室名称",
        variant: "destructive",
      });
      return;
    }
    
    const newRoom: ChatRoom = {
      id: Date.now().toString(),
      name: newRoomName.trim(),
      participants: Math.floor(Math.random() * 20) + 5,
      category: newRoomCategory,
      description: newRoomDescription.trim() || undefined,
    };
    
    setChatRooms(prev => [...prev, newRoom]);
    setNewRoomName('');
    setNewRoomDescription('');
    setCreateRoomDialogOpen(false);
    
    // Make sure category exists and is open
    if (!categories.some(cat => cat.name === newRoomCategory)) {
      setCategories(prev => [...prev, { name: newRoomCategory, isOpen: true }]);
    } else {
      setCategories(prev => 
        prev.map(cat => 
          cat.name === newRoomCategory 
            ? { ...cat, isOpen: true } 
            : cat
        )
      );
    }
    
    setActiveRoomId(newRoom.id);
    
    toast({
      title: "聊天室创建成功",
      description: `您已成功创建 "${newRoomName}" 聊天室`,
    });
  };
  
  const handleDeleteRoom = (roomId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('确定要删除这个聊天室吗？')) {
      // Don't allow deleting if it's one of the initial rooms (ids 1-8)
      if (Number(roomId) <= 8) {
        toast({
          title: "无法删除",
          description: "默认聊天室不能被删除",
          variant: "destructive",
        });
        return;
      }
      
      setChatRooms(prev => prev.filter(room => room.id !== roomId));
      
      // If active room is deleted, switch to the first available room
      if (activeRoomId === roomId) {
        setActiveRoomId('1');
      }
      
      toast({
        title: "聊天室已删除",
        description: "聊天室已成功删除",
      });
    }
  };
  
  const filteredRooms = chatRooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const groupedRooms = categories.map(category => ({
    ...category,
    rooms: filteredRooms.filter(room => room.category === category.name)
  })).filter(category => category.rooms.length > 0);
  
  return (
    <div className="w-72 border-r bg-card h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-4">聊天室</h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索聊天室..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        <div className="p-2">
          <Button 
            className="w-full justify-start gap-2" 
            variant="ghost"
            onClick={() => setCreateRoomDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            创建新聊天室
          </Button>
        </div>
        
        <div className="px-4 py-1">
          <Button 
            className="w-full justify-between bg-primary/10 hover:bg-primary/20 text-primary mb-2"
            variant="ghost"
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              所有聊天室
            </div>
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              {chatRooms.length}
            </span>
          </Button>
        </div>
        
        {groupedRooms.map((category) => (
          <div key={category.name} className="mb-2">
            <button
              className="w-full px-4 py-2 flex items-center justify-between text-sm text-muted-foreground hover:text-foreground"
              onClick={() => toggleCategory(category.name)}
            >
              <span className="font-medium">{category.name}</span>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform", 
                category.isOpen ? "transform rotate-0" : "transform rotate-180"
              )} />
            </button>
            
            {category.isOpen && (
              <div className="space-y-1 px-2">
                {category.rooms.map((room) => (
                  <Button
                    key={room.id}
                    variant={activeRoomId === room.id ? "secondary" : "ghost"}
                    className="w-full justify-between text-left h-auto py-2 group"
                    onClick={() => setActiveRoomId(room.id)}
                  >
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="truncate max-w-[140px]">{room.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground mr-2">
                        {room.participants}
                      </span>
                      {Number(room.id) > 8 && (
                        <button
                          onClick={(e) => handleDeleteRoom(room.id, e)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                        </button>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">匿名用户</p>
            <p className="text-xs text-muted-foreground">在线</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Create New Room Dialog */}
      <Dialog open={createRoomDialogOpen} onOpenChange={setCreateRoomDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建新聊天室</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">聊天室名称</label>
              <Input
                placeholder="输入聊天室名称"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="mb-1"
                autoFocus
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">分类</label>
              <select 
                className="w-full h-10 px-3 py-2 text-base bg-background border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={newRoomCategory}
                onChange={(e) => setNewRoomCategory(e.target.value)}
              >
                <option value="普通">普通</option>
                <option value="兴趣">兴趣</option>
                <option value="新闻">新闻</option>
                <option value="生活">生活</option>
                <option value="职业">职业</option>
                <option value="自定义">自定义</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">描述（可选）</label>
              <Input
                placeholder="输入聊天室描述"
                value={newRoomDescription}
                onChange={(e) => setNewRoomDescription(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                添加描述帮助其他用户了解这个聊天室的主题
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateRoomDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreateRoom} disabled={!newRoomName.trim()}>
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
