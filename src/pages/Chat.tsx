
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ChatSidebar } from '@/components/chat/ChatSidebar';

const Chat = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row h-[80vh] gap-4">
          <div className="hidden md:block h-full">
            <ChatSidebar />
          </div>
          <div className="flex-grow">
            <ChatInterface />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
