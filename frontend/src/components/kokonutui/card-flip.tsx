"use client";

/**
 * @author: @dorian_baffier
 * @description: Card Flip
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { cn } from "@/lib/utils";
import { ArrowRight, Repeat2 } from "lucide-react";
import { useState } from "react";

export interface CardFlipProps {
    title?: string;
    subtitle?: string;
    description?: string;
    features?: string[];
    buttonText?: string;
    onButtonClick?: () => void;
    accentColor?: 'orange' | 'blue';
}

export default function CardFlip({
    title = "Design Systems",
    subtitle = "Explore the fundamentals",
    description = "Dive deep into the world of modern UI/UX design.",
    features = ["UI/UX", "Modern Design", "Tailwind CSS", "Kokonut UI"],
    buttonText = "Start today",
    onButtonClick,
    accentColor = 'orange',
}: CardFlipProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const getAccentGradient = (index: number) => {
        if (accentColor === 'blue') {
            return [
                'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(96, 165, 250, 0.25) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(147, 197, 253, 0.2) 0%, transparent 70%)',
            ][index];
        }
        return [
            'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(254, 215, 170, 0.2) 0%, transparent 70%)',
        ][index];
    };

    const getAccentClasses = () => {
        if (accentColor === 'blue') {
            return {
                border: 'border-blue-500/30 dark:border-blue-500/40',
                text: 'text-blue-600 dark:text-blue-400',
                icon: 'text-blue-500',
                shadowColor: 'shadow-lg shadow-blue-500/10',
                hoverFrom: 'from-blue-500/10',
                hoverVia: 'via-blue-500/5',
                buttonGradient: 'dark:from-blue-700 dark:via-blue-700 dark:to-blue-700',
                buttonHoverFrom: 'hover:from-blue-500/10 hover:via-blue-500/5',
                darkButtonHoverFrom: 'dark:hover:from-blue-500/20 dark:hover:via-blue-500/10',
            };
        }
        return {
            border: 'border-orange-500/30 dark:border-orange-500/40',
            text: 'text-orange-600 dark:text-orange-400',
            icon: 'text-orange-500',
            shadowColor: 'shadow-lg shadow-orange-500/10',
            hoverFrom: 'from-orange-500/10',
            hoverVia: 'via-orange-500/5',
            buttonGradient: 'dark:from-orange-700 dark:via-orange-700 dark:to-orange-700',
            buttonHoverFrom: 'hover:from-orange-500/10 hover:via-orange-500/5',
            darkButtonHoverFrom: 'dark:hover:from-orange-500/20 dark:hover:via-orange-500/10',
        };
    };

    const accent = getAccentClasses();

    return (
        <div
            className="relative w-full max-w-[420px] h-[480px] group [perspective:2000px]"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div
                className={cn(
                    "relative w-full h-full",
                    "[transform-style:preserve-3d]",
                    "transition-all duration-700",
                    isFlipped
                        ? "[transform:rotateY(180deg)]"
                        : "[transform:rotateY(0deg)]"
                )}
            >
                <div
                    className={cn(
                        "absolute inset-0 w-full h-full",
                        "[backface-visibility:hidden] [transform:rotateY(0deg)]",
                        "overflow-hidden rounded-2xl",
                        "bg-zinc-50 dark:bg-zinc-900",
                        accent.border,
                        "shadow-xs dark:shadow-lg",
                        "transition-all duration-700",
                        "group-hover:shadow-lg dark:group-hover:shadow-xl",
                        accent.shadowColor,
                        isFlipped ? "opacity-0" : "opacity-100"
                    )}
                >
                    <div className="relative h-full overflow-hidden bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black">
                        <div className="absolute inset-0 flex items-start justify-center pt-24">
                            <div className="relative w-[200px] h-[100px] flex items-center justify-center">
                                {[...Array(10)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "absolute w-[50px] h-[50px]",
                                            "rounded-[140px]",
                                            "animate-[scale_3s_linear_infinite]",
                                            "opacity-0",
                                            "shadow-[0_0_50px_rgba(255,165,0,0.5)]",
                                            "group-hover:animate-[scale_2s_linear_infinite]"
                                        )}
                                        style={{
                                            animationDelay: `${i * 0.3}s`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <div className="space-y-1.5">
                                <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white leading-snug tracking-tighter transition-all duration-500 ease-out-expo group-hover:translate-y-[-4px]">
                                    {title}
                                </h3>
                                <p className="text-base text-zinc-600 dark:text-zinc-200 line-clamp-2 tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-4px] delay-[50ms]">
                                    {subtitle}
                                </p>
                            </div>
                            <div className="relative group/icon">
                                <div
                                    className={cn(
                                        "absolute inset-[-8px] rounded-lg transition-opacity duration-300",
                                        `bg-gradient-to-br ${accentColor === 'blue' ? 'from-blue-500/20 via-blue-500/10' : 'from-orange-500/20 via-orange-500/10'} to-transparent`
                                    )}
                                />
                                <Repeat2 className={cn("relative z-10 w-4 h-4 transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:-rotate-12", accent.icon)} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back of card */}
                <div
                    className={cn(
                        "absolute inset-0 w-full h-full",
                        "[backface-visibility:hidden] [transform:rotateY(180deg)]",
                        "p-6 rounded-2xl",
                        "bg-zinc-50 dark:bg-zinc-900",
                        accent.border,
                        "shadow-xs dark:shadow-lg",
                        "flex flex-col",
                        "transition-all duration-700",
                        "group-hover:shadow-lg dark:group-hover:shadow-xl",
                        accent.shadowColor,
                        !isFlipped ? "opacity-0" : "opacity-100",
                        "overflow-hidden relative"
                    )}
                >
                    {/* Background artifacts */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full blur-2xl transition-all duration-700"
                                style={{
                                    width: `${100 + i * 60}px`,
                                    height: `${100 + i * 60}px`,
                                    background: getAccentGradient(i % 3),
                                    left: `${10 + i * 20}%`,
                                    top: `${20 + i * 15}%`,
                                    opacity: isFlipped ? (0.6 - i * 0.12) : 0,
                                    transform: isFlipped 
                                        ? `scale(1) translateY(0px)` 
                                        : `scale(0.6) translateY(30px)`,
                                }}
                            />
                        ))}
                    </div>

                    <div className="flex-1 space-y-6 relative z-10">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white leading-snug tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px]">
                                {title}
                            </h3>
                            <p className="text-base text-zinc-600 dark:text-zinc-400 tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px] line-clamp-2">
                                {description}
                            </p>
                        </div>

                        <div className="space-y-2">
                            {features.map((feature, index) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-2 text-base text-zinc-700 dark:text-zinc-300 transition-all duration-500"
                                    style={{
                                        transform: isFlipped
                                            ? "translateX(0)"
                                            : "translateX(-10px)",
                                        opacity: isFlipped ? 1 : 0,
                                        transitionDelay: `${
                                            index * 100 + 200
                                        }ms`,
                                    }}
                                >
                                    <ArrowRight className={cn("w-3 h-3 transition-transform duration-500", accent.icon)} />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={cn("pt-6 mt-6 border-t", accent.border, "relative z-10")}>
                        <button
                            onClick={onButtonClick}
                            className={cn(
                                "group/start relative w-full",
                                "flex items-center justify-between",
                                "p-4 rounded-xl",
                                "transition-all duration-300",
                                "bg-zinc-100 dark:bg-zinc-800/50",
                                accentColor === 'blue' ? 'button-gradient-blue' : 'button-gradient-orange',
                                "hover:scale-[1.02] hover:cursor-pointer",
                                "text-left"
                            )}
                        >
                            <span className={cn("text-base font-medium text-zinc-900 dark:text-white transition-colors duration-300", `group-hover/start:${accent.text}`)}>
                                {buttonText}
                            </span>
                            <div className="relative group/icon">
                                <div
                                    className={cn(
                                        "absolute inset-[-6px] rounded-lg transition-all duration-300",
                                        `bg-gradient-to-br ${accentColor === 'blue' ? 'from-blue-500/20 via-blue-500/10' : 'from-orange-500/20 via-orange-500/10'} to-transparent`,
                                        "opacity-0 group-hover/start:opacity-100 scale-90 group-hover/start:scale-100"
                                    )}
                                />
                                <ArrowRight className={cn("relative z-10 w-4 h-4 transition-all duration-300 group-hover/start:translate-x-0.5 group-hover/start:scale-110", accent.icon)} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scale {
                    0% {
                        transform: scale(2);
                        opacity: 0;
                        box-shadow: 0px 0px 50px rgba(255, 165, 0, 0.5);
                    }
                    50% {
                        transform: translate(0px, -5px) scale(1);
                        opacity: 1;
                        box-shadow: 0px 8px 20px rgba(255, 165, 0, 0.5);
                    }
                    100% {
                        transform: translate(0px, 5px) scale(0.1);
                        opacity: 0;
                        box-shadow: 0px 10px 20px rgba(255, 165, 0, 0);
                    }
                }
                @keyframes gradient-shift {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
                .button-gradient-orange:hover {
                    background: linear-gradient(-45deg, rgba(249, 115, 22, 0.2), rgba(251, 146, 60, 0.1), rgba(249, 115, 22, 0.25), rgba(251, 146, 60, 0.15));
                    background-size: 300% 300%;
                    animation: gradient-shift 3s ease infinite;
                }
                .button-gradient-blue:hover {
                    background: linear-gradient(-45deg, rgba(59, 130, 246, 0.2), rgba(96, 165, 250, 0.1), rgba(59, 130, 246, 0.25), rgba(96, 165, 250, 0.15));
                    background-size: 300% 300%;
                    animation: gradient-shift 3s ease infinite;
                }
            `}</style>
        </div>
    );
}
