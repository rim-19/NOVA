"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
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

// Randomly assign ratings
const getRandomRating = () => Math.random() > 0.2 ? 5 : 4; // 80% chance of 5 stars

const reviews = reviewImages.map((image, index) => ({
  id: index + 1,
  image: image,
  rating: getRandomRating(),
}));

export function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  const dragX = useMotionValue(0);
  const dragConstraints = { left: -(reviews.length - 1) * 400, right: 0 };

  // Auto-play logic
  useEffect(() => {
    if (!isDragging && autoPlayEnabled) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          if (next >= reviews.length) {
            return 0;
          }
          return next;
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isDragging, autoPlayEnabled]);

  // Sync drag position with current index
  useEffect(() => {
    if (!isDragging) {
      controls.start({ x: -currentIndex * 400 });
    }
  }, [currentIndex, controls, isDragging]);

  const handleDragStart = () => {
    setIsDragging(true);
    setAutoPlayEnabled(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const dragOffset = dragX.get();
    const newIndex = Math.round(-dragOffset / 400);
    const clampedIndex = Math.max(0, Math.min(newIndex, reviews.length - 1));
    setCurrentIndex(clampedIndex);
    
    // Resume auto-play after 5 seconds
    setTimeout(() => {
      setAutoPlayEnabled(true);
    }, 5000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={i < rating ? "#B8956A" : "none"}
        stroke={i < rating ? "#B8956A" : "rgba(184,149,106,0.3)"}
        strokeWidth="1"
        className="inline-block"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  return (
    <section className="py-12 px-6 md:px-12" style={{ background: "linear-gradient(180deg, #2B0303 0%, #390A16 100%)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-gold/60 mb-3">Customer Experiences</p>
          <h2 className="font-cormorant text-3xl md:text-4xl italic text-cream">Real Reviews</h2>
        </div>

        {/* Reviews Carousel */}
        <div className="relative overflow-hidden rounded-2xl" style={{ background: "rgba(26,2,2,0.6)" }}>
          <div className="relative h-[350px] md:h-[400px]">
            <motion.div
              ref={carouselRef}
              className="flex h-full"
              drag="x"
              dragConstraints={dragConstraints}
              dragElastic={0.2}
              dragMomentum={true}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              animate={controls}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  className="flex-shrink-0 w-[400px] h-full flex flex-col items-center justify-center p-8"
                  style={{ 
                    borderLeft: index === 0 ? "none" : "1px solid rgba(184,149,106,0.1)",
                    borderRight: index === reviews.length - 1 ? "none" : "1px solid rgba(184,149,106,0.1)"
                  }}
                >
                  {/* Screenshot */}
                  <div className="relative w-full max-w-[320px] h-[240px] md:h-[280px] rounded-xl overflow-hidden mb-6 shadow-[0_12px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(184,149,106,0.15)]">
                    <Image
                      src={review.image}
                      alt={`Review ${review.id}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Try a random image if this one doesn't exist
                        const randomIndex = Math.floor(Math.random() * reviewImages.length);
                        const target = e.target as HTMLImageElement;
                        target.src = reviewImages[randomIndex];
                      }}
                    />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1">
                    {renderStars(review.rating)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Progress Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {reviews.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-8 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-gold/80" 
                    : "bg-cream/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Subtle hint text */}
        <div className="text-center mt-6">
          <p className="text-[0.55rem] uppercase tracking-[0.2em] text-cream/40">
            Drag to explore • Auto-playing
          </p>
        </div>
      </div>
    </section>
  );
}
