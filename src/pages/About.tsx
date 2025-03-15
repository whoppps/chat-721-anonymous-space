
import React, { useEffect, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Shield, Lock, Users, MessageSquare } from 'lucide-react';

const About = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<Array<HTMLDivElement | null>>([]);
  const teamRef = useRef<HTMLDivElement>(null);
  
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
    
    if (heroRef.current) observer.observe(heroRef.current);
    if (missionRef.current) observer.observe(missionRef.current);
    if (teamRef.current) observer.observe(teamRef.current);
    
    valueRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (missionRef.current) observer.unobserve(missionRef.current);
      if (teamRef.current) observer.unobserve(teamRef.current);
      
      valueRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div 
          ref={heroRef}
          className="text-center mb-20 opacity-0"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">关于我们</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            721匿名聊天網是一个致力于提供安全、匿名交流环境的平台，
            让每个人都能自由表达自己的想法和感受。
          </p>
        </div>
        
        {/* Mission Section */}
        <div 
          ref={missionRef}
          className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center opacity-0"
        >
          <div>
            <h2 className="text-3xl font-bold mb-6">我们的使命</h2>
            <p className="text-muted-foreground mb-4">
              在数字世界中创建一个安全的避风港，让人们能够无顾虑地交流和表达。
              我们相信匿名性是促进真实表达的关键，特别是对于那些在现实生活中
              可能无法自由表达的人。
            </p>
            <p className="text-muted-foreground">
              通过提供这样一个平台，我们希望促进理解、同理心和有意义的对话，
              让人们在不受身份限制的情况下分享想法和建立联系。
            </p>
          </div>
          <div className="bg-accent/50 p-10 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-32 h-32 text-primary/20" />
          </div>
        </div>
        
        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">我们的核心价值观</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "隐私与匿名",
                description: "我们将用户隐私视为最高优先级。我们的平台设计确保用户可以在不透露个人身份的情况下进行交流。"
              },
              {
                icon: Users,
                title: "包容与尊重",
                description: "我们鼓励多元化的观点和开放的对话，同时坚持所有用户都应得到尊重的原则。"
              },
              {
                icon: Lock,
                title: "安全与信任",
                description: "我们采取严格的安全措施保护用户数据和对话，建立一个可以信任的交流环境。"
              }
            ].map((value, index) => (
              <div
                key={index}
                ref={el => valueRefs.current[index] = el}
                className="bg-card border rounded-xl p-6 opacity-0"
                style={{ animationDelay: `${200 * index}ms` }}
              >
                <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Team Section */}
        <div 
          ref={teamRef}
          className="opacity-0"
        >
          <h2 className="text-3xl font-bold mb-10 text-center">我们的团队</h2>
          <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto mb-10">
            我们是一群对隐私和自由表达充满热情的技术专家和设计师，
            致力于创建最佳的匿名交流平台。
          </p>
          <div className="bg-accent/50 p-10 rounded-2xl text-center">
            <h3 className="text-xl font-medium mb-4">加入我们的团队</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              我们始终在寻找志同道合的人才加入我们的团队。
              如果您对隐私、安全和创建有意义的在线交流空间充满热情，
              我们希望听到您的声音。
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
