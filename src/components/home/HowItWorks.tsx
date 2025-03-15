
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: "01",
    title: "访问网站",
    description: "打开721匿名聊天網，无需注册或登录"
  },
  {
    number: "02",
    title: "进入聊天室",
    description: "选择一个聊天室或创建自己的私人房间"
  },
  {
    number: "03",
    title: "开始交流",
    description: "即刻开始与其他匿名用户分享想法和交流"
  },
  {
    number: "04",
    title: "安全离开",
    description: "随时离开聊天，不留下任何个人痕迹"
  }
];

export const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stepsRef = useRef<Array<HTMLDivElement | null>>([]);
  
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
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    if (titleRef.current) observer.observe(titleRef.current);
    stepsRef.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      if (titleRef.current) observer.unobserve(titleRef.current);
      stepsRef.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef}
      className="py-20 px-6 bg-accent/50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold mb-4 opacity-0"
          >
            如何使用
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            简单四步，开始您的匿名聊天之旅
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={el => stepsRef.current[index] = el}
              className={cn(
                "rounded-xl p-6 opacity-0 flex flex-col items-center text-center",
                `animate-delay-${index * 100}`
              )}
              style={{ 
                animationDelay: `${100 * index}ms`,
                transitionDelay: `${100 * index}ms`
              }}
            >
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                {step.number}
              </div>
              <div className="h-px w-16 bg-border my-4 md:hidden"></div>
              <h3 className="text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block h-px w-16 bg-border absolute right-0 top-1/2 transform translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
