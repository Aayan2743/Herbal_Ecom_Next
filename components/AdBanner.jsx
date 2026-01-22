"use client";

import React, { useEffect, useState } from "react";

const bannerImages = [
  "/banner1.webp",
  "/banner1.webp",
  "/banner1.webp",
];

const INTERVAL = 4000; // 4 seconds

const AdBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[420px] lg:h-[520px] overflow-hidden mb-8">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {bannerImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Banner ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerImages.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AdBanner;
