
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Chat = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Close sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {isMobile && (
          <div className="mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden flex items-center gap-2"
            >
              <Menu className="h-4 w-4" />
              {sidebarOpen ? '关闭聊天室列表' : '打开聊天室列表'}
            </Button>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row h-[80vh] gap-4">
          {(sidebarOpen || !isMobile) && (
            <div className={`${isMobile ? 'w-full h-full fixed top-0 left-0 z-50 bg-background' : 'hidden md:block h-full'}`}>
              {isMobile && (
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="font-semibold">聊天室列表</h2>
                  <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                    关闭
                  </Button>
                </div>
              )}
              <ChatSidebar />
            </div>
          )}
          <div className="flex-grow">
            <ChatInterface />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
