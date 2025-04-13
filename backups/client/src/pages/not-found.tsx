import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a]">
      <Card className="w-full max-w-md mx-4 bg-[#1e293b] border-[#FF7A00] border">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-6 text-center">
            <AlertCircle className="h-16 w-16 text-[#FF7A00] mb-4" />
            <h1 className="text-3xl font-bold text-white">404 頁面未找到</h1>
          </div>

          <p className="mt-4 text-base text-[#94a3b8] text-center mb-6">
            您訪問的頁面不存在或已被移除。
          </p>
          
          <div className="flex justify-center">
            <Link href="/">
              <Button className="bg-[#FF7A00] hover:bg-[#FDBA74] text-white">
                返回首頁
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
