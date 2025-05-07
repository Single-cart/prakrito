"use client";

import { Button } from "@workspace/ui/components/button";
import { CheckCircle2, Home } from "lucide-react";

const Success = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-bengali">
          অর্ডার সফলভাবে গৃহীত হয়েছে
        </h1>

        <p className="text-gray-600 font-bengali">
          আমরা খুব শীঘ্রই আপনার সাথে যোগাযোগ করব। অর্ডার করার জন্য ধন্যবাদ।
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleGoBack}
          >
            <Home className="h-4 w-4" />
            <span className="font-bengali">হোম পেজে ফিরুন</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;
