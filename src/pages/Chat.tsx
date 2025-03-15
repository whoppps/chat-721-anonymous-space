
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { ChatInterface } from '@/components/chat/ChatInterface';

const Chat = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col h-[80vh]">
          <ChatInterface />
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
