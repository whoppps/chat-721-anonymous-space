
import React, { useEffect, useRef } from 'react';
import { Shield, Lock, Zap, PenTool, Heart, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Shield,
    title: "匿名保护",
    description: "我们不收集任何可识别个人身份的信息，确保您的隐私得到最大保护"
  },
  {
    icon: Lock,
    title: "端到端加密",
    description: "所有对话都经过加密，只有参与对话的各方可以查看内容"
  },
  {
    icon: Zap,
    title: "即时连接",
    description: "无需等待，立即开始与世界各地的人们交流"
  },
  {
    icon: PenTool,
    title: "自由表达",
    description: "在一个安全的空间内分享您的想法、感受和创意"
  },
  {
    icon: Heart,
    title: "社区支持",
    description: "在我们的平台上找到理解和共鸣，建立真实的联系"
  },
  {
    icon: Award,
    title: "无广告体验",
    description: "专注于交流，没有烦人的广告或推广内容干扰"
  }
];

export const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const featureRefs = useRef<Array<HTMLDivElement | null>>([]);
  
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
    featureRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      featureRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef}
      className="py-20 px-6 opacity-0"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">为什么选择721匿名聊天網</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            我们的平台专为那些寻求安全、自由表达自己的人而设计
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => featureRefs.current[index] = el}
              className={cn(
                "rounded-xl p-6 opacity-0 transition-all duration-500 border",
                `animate-delay-${(index % 3) * 100}`
              )}
              style={{ 
                animationDelay: `${100 * (index % 3)}ms`,
                transitionDelay: `${100 * (index % 3)}ms`
              }}
            >
              <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
