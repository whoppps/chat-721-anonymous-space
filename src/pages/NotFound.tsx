
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <div className="mb-6 flex justify-center">
            <div className="text-8xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
              404
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">页面未找到</h1>
          <p className="text-muted-foreground mb-8">
            抱歉，您尝试访问的页面不存在。它可能已被移动、删除或者从未存在过。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="gap-2"
            >
              返回上一页
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="gap-2"
            >
              返回首页
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
