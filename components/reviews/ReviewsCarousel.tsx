"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useMotionValue, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Get all review images from the folder
const reviewImages = [
  "/new_assets/reviews/review1.jpeg",
  "/new_assets/reviews/review2.jpeg", 
  "/new_assets/reviews/review3.jpeg",
  "/new_assets/reviews/review4.jpeg",
  "/new_assets/reviews/review5.jpeg",
  "/new_assets/reviews/review6.jpeg",
  "/new_assets/reviews/review7.jpeg",
  "/new_assets/reviews/review8.jpeg",
];

// All 5 stars
const reviews = reviewImages.map((image, index) => ({
  id: index + 1,
  image: image,
  rating: 5,
}));

export function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play with smooth timing
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }, 4000); // 4 seconds for smooth viewing
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="#B8956A"
        className="inline-block"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  return (
    <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-[#1a0202] to-[#2a0508]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-gold/60 mb-4">Customer Voices</p>
          <h2 className="font-cormorant text-4xl md:text-5xl italic text-cream mb-4">Real Experiences</h2>
          <p className="font-montecarlo text-xl text-gold/70">What our clients say about NOVA</p>
        </div>

        {/* Main Review Display */}
        <div className="relative h-[500px] md:h-[600px] mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative max-w-4xl mx-auto">
                {/* Phone Frame Mockup */}
                <div className="relative mx-auto w-[280px] md:w-[320px] h-[560px] md:h-[640px] bg-black rounded-[3rem] p-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                  {/* Phone Screen */}
                  <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-black/10 z-10 flex items-center justify-center">
                      <div className="w-16 h-1 bg-black/20 rounded-full"></div>
                    </div>
                    
                    {/* Review Image */}
                    <div className="relative w-full h-full">
                      <Image
                        src={reviews[currentIndex].image}
                        alt={`Review ${reviews[currentIndex].id}`}
                        fill
                        className="object-cover"
                        priority
                        onError={(e) => {
                          const randomIndex = Math.floor(Math.random() * reviewImages.length);
                          const target = e.target as HTMLImageElement;
                          target.src = reviewImages[randomIndex];
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Review Details */}
                <div className="text-center mt-8">
                  <div className="flex justify-center gap-1 mb-4">
                    {renderStars()}
                  </div>
                  <p className="text-cream/60 text-sm">Verified Customer</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3 mb-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? "w-12 h-1 bg-gold shadow-[0_0_10px_rgba(184,149,106,0.5)]"
                  : "w-8 h-0.5 bg-cream/30 hover:bg-cream/50"
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play Indicator */}
        <div className="text-center">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-gold/60 hover:text-gold transition-colors text-xs uppercase tracking-[0.2em]"
          >
            {isAutoPlaying ? "Pause" : "Play"} Slideshow
          </button>
        </div>
      </div>
    </section>
  );
}
