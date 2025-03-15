
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareText, Shield, Heart, Info } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-background/50 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto py-10 px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MessageSquareText className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">721匿名聊天網</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              安全、匿名的聊天平台，连接世界各地的人们
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">导航</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  聊天
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  关于我们
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">法律</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  使用条款
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  隐私政策
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">联系我们</h4>
            <p className="text-sm text-muted-foreground">
              如有任何问题或建议，请随时与我们联系
            </p>
            <div className="flex space-x-4 mt-4">
              <Link to="/contact" className="text-sm font-medium hover:underline">
                联系方式
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} 721匿名聊天網. 保留所有权利.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Shield className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            <Heart className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};
