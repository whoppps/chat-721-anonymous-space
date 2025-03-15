
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ShieldCheck, Globe } from 'lucide-react';

export const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up', 'opacity-100');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (titleRef.current) observer.observe(titleRef.current);
    if (descriptionRef.current) observer.observe(descriptionRef.current);
    if (buttonsRef.current) observer.observe(buttonsRef.current);
    if (featureRef.current) observer.observe(featureRef.current);
    
    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      if (descriptionRef.current) observer.unobserve(descriptionRef.current);
      if (buttonsRef.current) observer.unobserve(buttonsRef.current);
      if (featureRef.current) observer.unobserve(featureRef.current);
    };
  }, []);
  
  return (
    <section className="relative overflow-hidden px-6 pt-10 pb-20 md:pt-20 md:pb-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div 
        className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" 
        aria-hidden="true"
      />
      <div 
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" 
        aria-hidden="true"
      />
      
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            安全 • 匿名 • 自由
          </span>
        </div>
        
        <h1 
          ref={titleRef}
          className="text-4xl font-bold tracking-tight md:text-6xl mb-6 opacity-0"
        >
          在<span className="text-primary">721匿名聊天網</span>中
          <br />
          表达真实的自己
        </h1>
        
        <p 
          ref={descriptionRef}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 opacity-0 animate-delay-100"
        >
          在一个完全匿名和安全的环境中分享您的想法和感受。
          不需要注册，无需个人信息，开始畅所欲言。
        </p>
        
        <div 
          ref={buttonsRef}
          className="flex flex-col sm:flex-row justify-center gap-4 opacity-0 animate-delay-200"
        >
          <Link
            to="/chat"
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            开始聊天
          </Link>
          <Link
            to="/about"
            className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-accent transition-all duration-300 hover:-translate-y-1"
          >
            了解更多
          </Link>
        </div>
      </div>
      
      <div 
        ref={featureRef}
        className="max-w-5xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-0 animate-delay-300"
      >
        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 hover:bg-card transition-colors duration-300">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">完全匿名</h3>
          <p className="text-muted-foreground">无需注册账户或提供个人信息，保护您的隐私</p>
        </div>
        
        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 hover:bg-card transition-colors duration-300">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">实时对话</h3>
          <p className="text-muted-foreground">即时连接并与来自世界各地的人交流想法</p>
        </div>
        
        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 hover:bg-card transition-colors duration-300">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">全球社区</h3>
          <p className="text-muted-foreground">跨越国界与来自不同文化背景的人交流</p>
        </div>
      </div>
    </section>
  );
};
