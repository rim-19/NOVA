"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const paragraphs = [
  "It is not about what you show.",
  "It is about what you bring into a room.",
  "An energy. A presence. A quiet confidence.",
  "We do not simply create lingerie.",
  "We curate pieces designed to reveal your femininity, to highlight your natural lines, and to awaken the kind of confidence that changes everything.",
  "Each piece is chosen with intention.",
  "Fabrics are selected for their softness and elegance.",
  "Cuts are designed to embrace the body without restricting it.",
  "Nothing is left to chance.",
  "NovaLingerie is for women who understand that sensuality does not need to be loud.",
  "It is felt in a glance.",
  "In the way you walk.",
  "In the way you carry yourself.",
  "We believe lingerie should not transform a woman.",
  "It should reveal who she already is.",
  "A woman who owns herself.",
  "A woman who chooses.",
  "A woman who shines without asking for permission.",
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [desktopAboutSrc, setDesktopAboutSrc] = useState("/new_assets/about1.jpg");
  const [mobileAboutSrc, setMobileAboutSrc] = useState("/new_assets/about2.jpg");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".reveal-text",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "power3.out" }
      );
      gsap.fromTo(
        ".reveal-image",
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen pt-28 md:pt-32 pb-20 md:pb-24 px-4 sm:px-6 md:px-12"
      style={{ background: "linear-gradient(180deg, #2B0303 0%, #390A16 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        <p
          className="text-label mb-5 md:mb-6 reveal-text text-center"
          style={{ color: "rgba(184,149,106,0.5)" }}
        >
          About NovaLingerie
        </p>

        <h1
          className="reveal-text text-center mb-8 md:mb-12"
          style={{
            fontFamily: "MonteCarlo, cursive",
            fontSize: "clamp(2.8rem, 10vw, 6rem)",
            color: "#F5E9E2",
            lineHeight: 1,
          }}
        >
          Desire, Redefined.
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 flex flex-col gap-5 md:gap-6 text-center lg:text-center lg:max-w-[48ch] lg:justify-center lg:min-h-full">
            {paragraphs.map((text) => (
              <p
                key={text}
                className="reveal-text"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 300,
                  fontSize: "clamp(0.95rem, 2.6vw, 1.02rem)",
                  lineHeight: 1.9,
                  color: "rgba(245,233,226,0.72)",
                  letterSpacing: "0.02em",
                }}
              >
                {text}
              </p>
            ))}

            <div className="pt-4 md:pt-6 reveal-text">
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(1.15rem, 4vw, 1.7rem)",
                  color: "rgba(245,233,226,0.95)",
                  lineHeight: 1.5,
                }}
              >
                NovaLingerie - For your femininity. For you.
              </p>
              <p
                className="mt-8"
                style={{
                  fontFamily: "MonteCarlo, cursive",
                  fontSize: "clamp(2rem, 5vw, 2.7rem)",
                  color: "rgba(245,233,226,0.95)",
                  lineHeight: 1,
                }}
              >
                Nova
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 reveal-image lg:justify-self-end">
            <div
              className="relative w-full max-w-[520px] mx-auto lg:mx-0 h-[520px] sm:h-[620px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl"
              style={{ boxShadow: "0 28px 85px rgba(0,0,0,0.52), 0 0 0 1px rgba(184,149,106,0.14)" }}
            >
              <img
                src={desktopAboutSrc}
                alt="NovaLingerie model"
                className="absolute inset-0 hidden h-full w-full object-cover lg:block"
                style={{ filter: "brightness(0.85) contrast(1.05) saturate(0.9)" }}
                onError={() => setDesktopAboutSrc("/new_assets/about2.jpg")}
              />
              <img
                src={mobileAboutSrc}
                alt="NovaLingerie model"
                className="absolute inset-0 h-full w-full object-cover lg:hidden"
                style={{ filter: "brightness(0.85) contrast(1.05) saturate(0.9)" }}
                onError={() => setMobileAboutSrc("/new_assets/about1.jpg")}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-base/35" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
