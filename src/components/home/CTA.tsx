
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export const CTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in', 'opacity-100');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef}
      className="py-20 px-6 opacity-0"
    >
      <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5"
          aria-hidden="true"
        />
        
        <div className="relative z-10 py-16 px-6 md:px-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            准备好开始匿名交流了吗？
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            加入我们的平台，与来自世界各地的人们分享想法，
            探索新的观点，建立真实的连接。
          </p>
          <Link
            to="/chat"
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            立即开始聊天
          </Link>
        </div>
      </div>
    </section>
  );
};
