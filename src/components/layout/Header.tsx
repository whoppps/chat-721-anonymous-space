
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MessageSquareText, Moon, Sun } from 'lucide-react';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-10",
        scrolled ? "py-3 glass border-b" : "py-5"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <MessageSquareText 
            className={cn(
              "w-7 h-7 transition-all duration-300", 
              scrolled ? "text-primary" : "text-primary/90"
            )} 
          />
          <h1 
            className={cn(
              "text-xl font-semibold transition-all duration-300", 
              scrolled ? "text-primary" : "text-primary/90"
            )}
          >
            721匿名聊天網
          </h1>
        </Link>
        
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link 
            to="/chat"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
              scrolled 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "bg-primary/90 text-primary-foreground hover:bg-primary"
            )}
          >
            开始聊天
          </Link>
          
          {isClient && (
            <button
              aria-label="Toggle theme"
              className="rounded-full p-2 bg-background/50 hover:bg-accent transition-colors"
              onClick={() => {
                document.documentElement.classList.toggle('dark');
              }}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
