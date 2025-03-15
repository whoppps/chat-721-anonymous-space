
import React, { useState } from 'react';
import { Search, Users, Settings, ChevronDown, Plus, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatRoom {
  id: string;
  name: string;
  participants: number;
  category: string;
}

const CHAT_ROOMS: ChatRoom[] = [
  { id: '1', name: '日常交流', participants: 42, category: '普通' },
  { id: '2', name: '音乐爱好者', participants: 28, category: '兴趣' },
  { id: '3', name: '电影讨论', participants: 35, category: '兴趣' },
  { id: '4', name: '科技新闻', participants: 19, category: '新闻' },
  { id: '5', name: '游戏玩家', participants: 64, category: '兴趣' },
  { id: '6', name: '美食分享', participants: 31, category: '生活' },
  { id: '7', name: '旅行故事', participants: 24, category: '生活' },
  { id: '8', name: '职场交流', participants: 37, category: '职业' },
];

interface Category {
  name: string;
  isOpen: boolean;
}

export const ChatSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([
    { name: '普通', isOpen: true },
    { name: '兴趣', isOpen: true },
    { name: '新闻', isOpen: true },
    { name: '生活', isOpen: true },
    { name: '职业', isOpen: true },
  ]);
  
  const toggleCategory = (categoryName: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.name === categoryName 
          ? { ...cat, isOpen: !cat.isOpen } 
          : cat
      )
    );
  };
  
  const filteredRooms = CHAT_ROOMS.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const groupedRooms = categories.map(category => ({
    ...category,
    rooms: filteredRooms.filter(room => room.category === category.name)
  }));
  
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
              {CHAT_ROOMS.length}
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
                    variant="ghost"
                    className="w-full justify-between text-left h-auto py-2"
                  >
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{room.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {room.participants}
                    </span>
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
    </div>
  );
};
