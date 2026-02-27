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
  const containerRef = useRef<HTMLDivElement>(null);

  // We clone the items to create a seamless infinite loop
  // Original: [1,2,3,4,5,6,7,8]
  // Extended: [1,2,3,4,5,6,7,8, 1,2,3,4,5,6,7,8, 1,2,3,4,5,6,7,8]
  // We start in the middle set (index 8 to 15)
  const extendedReviews = [...reviews, ...reviews, ...reviews];
  const [displayIndex, setDisplayIndex] = useState(reviews.length);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const ITEM_WIDTH = 260; // 240px width + 20px (approx gap/padding)

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, displayIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setDisplayIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setDisplayIndex((prev) => prev - 1);
  };

  // Infinite loop logic: when we hit the end of our "middle" set, 
  // jump back to the equivalent index in the middle set without animation
  useEffect(() => {
    if (displayIndex >= reviews.length * 2) {
      // Small timeout to allow the last transition to finish
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setDisplayIndex(reviews.length);
      }, 500);
      return () => clearTimeout(timer);
    }
    if (displayIndex < reviews.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setDisplayIndex(reviews.length * 2 - 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [displayIndex]);

  // Sync currentIndex for navigation dots
  useEffect(() => {
    setCurrentIndex(displayIndex % reviews.length);
  }, [displayIndex]);

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setIsTransitioning(true);
    setDisplayIndex(reviews.length + index);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#B8956A">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  return (
    <section className="py-24 bg-[#1a0202] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-gold/50 mb-3">Testimonials</p>
          <h2 className="font-cormorant text-4xl italic text-cream">Client Experiences</h2>
        </div>

        <div className="relative" ref={containerRef}>
          <div className="flex justify-center items-center">
            <motion.div
              animate={{
                x: `calc(50% - ${(displayIndex * 260) + 120}px)`
              }}
              transition={isTransitioning ? { type: "spring", stiffness: 300, damping: 30 } : { duration: 0 }}
              className="flex gap-5"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {extendedReviews.map((review, idx) => {
                const isActive = idx === displayIndex;
                return (
                  <motion.div
                    key={`${review.id}-${idx}`}
                    initial={false}
                    animate={{
                      scale: isActive ? 1 : 0.85,
                      opacity: isActive ? 1 : 0.4,
                    }}
                    className="flex-shrink-0 w-[240px]"
                  >
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black/20">
                      <Image
                        src={review.image}
                        alt={`Review ${review.id}`}
                        fill
                        className="object-contain"
                        sizes="240px"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex gap-1 mb-1">
                          {renderStars()}
                        </div>
                        <p className="text-cream/80 text-[0.6rem] uppercase tracking-widest font-light">Verified Ritual</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-1 transition-all duration-500 rounded-full ${index === currentIndex
                ? "w-10 bg-gold"
                : "w-4 bg-white/10 hover:bg-white/20"
                }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
