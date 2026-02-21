"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface ArtifactProps {
    src: string;
    position: { top?: string; bottom?: string; left?: string; right?: string };
    rotation?: number;
    opacity?: number;
    scale?: number;
    blur?: string;
    duration?: number;
}

export function PrivateTeaserArtifacts() {
    const pathname = usePathname();

    // Do not show in admin backoffice
    if (pathname?.startsWith('/atelier-admin')) return null;

    // Use all 7 images from blurred_assets with HIGH visibility
    const artifacts: ArtifactProps[] = [
        {
            src: "/assets/blurred_assets/image.png",
            position: { top: "10%", left: "5%" },
            rotation: 12,
            opacity: 0.8,
            scale: 1.1,
            blur: "blur(2px)", // Almost sharp
            duration: 15
        },
        {
            src: "/assets/blurred_assets/image copy.png",
            position: { top: "25%", right: "5%" },
            rotation: -8,
            opacity: 0.7,
            scale: 1.2,
            blur: "blur(4px)",
            duration: 18
        },
        {
            src: "/assets/blurred_assets/image copy 2.png",
            position: { top: "45%", left: "2%" },
            rotation: 15,
            opacity: 0.75,
            scale: 1.0,
            blur: "blur(3px)",
            duration: 22
        },
        {
            src: "/assets/blurred_assets/image copy 3.png",
            position: { top: "65%", right: "8%" },
            rotation: -45,
            opacity: 0.65,
            scale: 1.1,
            blur: "blur(5px)",
            duration: 20
        },
        {
            src: "/assets/blurred_assets/image copy 4.png",
            position: { bottom: "15%", left: "5%" },
            rotation: 20,
            opacity: 0.8,
            scale: 0.9,
            blur: "blur(2px)",
            duration: 25
        },
        {
            src: "/assets/blurred_assets/image copy 5.png",
            position: { bottom: "35%", right: "2%" },
            rotation: -15,
            opacity: 0.72,
            scale: 1.2,
            blur: "blur(4px)",
            duration: 14
        },
        {
            src: "/assets/blurred_assets/image copy 6.png",
            position: { bottom: "55%", left: "10%" },
            rotation: 5,
            opacity: 0.6,
            scale: 1.3,
            blur: "blur(6px)",
            duration: 30
        }
    ];

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            {artifacts.map((art, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                        opacity: [art.opacity! * 0.9, art.opacity!, art.opacity! * 0.9],
                        y: [-60, 60, -60],
                        rotate: [art.rotation! - 10, art.rotation! + 10, art.rotation! - 10]
                    }}
                    transition={{
                        opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: art.duration || 10, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: (art.duration || 10) * 1.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute will-change-transform"
                    style={{
                        ...art.position,
                        filter: art.blur
                    }}
                >
                    <Image
                        src={art.src}
                        alt=""
                        width={500}
                        height={700}
                        className="object-contain"
                        style={{ transform: `scale(${art.scale})` }}
                    />
                </motion.div>
            ))}

            {/* Cinematic Red Glows - Stronger */}
            <div
                className="absolute top-[20%] right-[5%] w-[60vw] h-[60vw] rounded-full pointer-events-none opacity-50 mix-blend-screen"
                style={{
                    background: "radial-gradient(circle, rgba(125,23,54,0.4) 0%, transparent 70%)",
                    filter: "blur(100px)"
                }}
            />
            <div
                className="absolute bottom-[20%] left-[5%] w-[50vw] h-[50vw] rounded-full pointer-events-none opacity-40 mix-blend-screen"
                style={{
                    background: "radial-gradient(circle, rgba(125,23,54,0.3) 0%, transparent 70%)",
                    filter: "blur(80px)"
                }}
            />
        </div>
    );
}
