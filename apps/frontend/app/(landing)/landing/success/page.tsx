"use client";

import Image from "next/image";

const Success = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-3">
      <Image
        src={"/order-success.png"}
        width={100}
        height={100}
        alt="Order Success"
      />

      <h1 className="text-lg md:text-2xl font-semibold">
        আপনার অর্ডার সফলভাবে গৃহীত হয়েছে।
      </h1>

      <h1>বিঃদ্রঃ আমরা খুব শীঘ্রই যোগাযোগ করব। অর্ডার করার জন্য ধন্যবাদ</h1>
      <div className="flex items-center justify-center gap-2 font-semibold">
        <h3>
          <button
            onClick={handleGoBack}
            className="text-blue-500 font-semibold cursor-pointer"
          >
            হোম পেজে ফিরে যান
          </button>
        </h3>
      </div>
    </div>
  );
};

export default Success;
