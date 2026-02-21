"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only show custom cursor on desktop
        if (window.matchMedia("(hover: none)").matches) return;

        // Enable custom cursor state on body
        document.body.classList.add("has-custom-cursor");

        const cursor = cursorRef.current;
        const dot = dotRef.current;
        if (!cursor || !dot) return;

        // Ensure visible initially
        gsap.set([cursor, dot], { opacity: 1 });

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot follows instantly
            gsap.to(dot, {
                left: mouseX,
                top: mouseY,
                duration: 0,
            });
        };

        const animate = () => {
            cursorX += (mouseX - cursorX) * 0.12;
            cursorY += (mouseY - cursorY) * 0.12;

            gsap.set(cursor, { left: cursorX, top: cursorY });
            requestAnimationFrame(animate);
        };

        const raf = requestAnimationFrame(animate);
        document.addEventListener("mousemove", onMouseMove);

        const interactables = document.querySelectorAll("a, button, .cursor-hover");
        const handleEnter = () => {
            gsap.to(cursor, { scale: 1.8, borderColor: "rgba(184, 149, 106, 0.8)", duration: 0.3 });
            gsap.to(dot, { scale: 0, duration: 0.3 });
        };
        const handleLeave = () => {
            gsap.to(cursor, { scale: 1, borderColor: "rgba(125, 23, 54, 0.6)", duration: 0.3 });
            gsap.to(dot, { scale: 1, duration: 0.3 });
        };

        interactables.forEach(el => {
            el.addEventListener("mouseenter", handleEnter);
            el.addEventListener("mouseleave", handleLeave);
        });

        return () => {
            document.body.classList.remove("has-custom-cursor");
            document.removeEventListener("mousemove", onMouseMove);
            cancelAnimationFrame(raf);
            interactables.forEach(el => {
                el.removeEventListener("mouseenter", handleEnter);
                el.removeEventListener("mouseleave", handleLeave);
            });
        };
    }, []);

    return (
        <div className="hidden lg:block">
            {/* Ring cursor */}
            <div
                ref={cursorRef}
                className="fixed pointer-events-none z-[9999] opacity-0"
                style={{
                    left: 0,
                    top: 0,
                    width: 36,
                    height: 36,
                    marginLeft: -18,
                    marginTop: -18,
                    border: "1px solid rgba(125, 23, 54, 0.6)",
                    borderRadius: "50%",
                }}
            />
            {/* Center dot */}
            <div
                ref={dotRef}
                className="fixed pointer-events-none z-[9999] opacity-0"
                style={{
                    left: 0,
                    top: 0,
                    width: 5,
                    height: 5,
                    marginLeft: -2.5,
                    marginTop: -2.5,
                    background: "#7D1736",
                    borderRadius: "50%",
                }}
            />
        </div>
    );
}
