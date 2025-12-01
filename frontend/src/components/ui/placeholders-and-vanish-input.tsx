"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
  className,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const startAnimation = () => {
      intervalRef.current = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
      }, 3000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible" && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else if (document.visibilityState === "visible") {
        startAnimation();
      }
    };

    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [placeholders]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(e);
    setValue("");
  };
  
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onChange?.(e);
    
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <form
      className={cn(
        "w-full relative max-w-xl mx-auto bg-zinc-800 rounded-3xl overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200",
        value && "bg-zinc-800",
        className
      )}
      onSubmit={handleSubmit}
    >
      <textarea
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={value}
        rows={1}
        className={cn(
          "w-full relative text-sm sm:text-base z-50 border-none text-white bg-transparent rounded-3xl focus:outline-none focus:ring-0 pl-4 sm:pl-10 pr-20 py-4 resize-none overflow-hidden min-h-[3rem]",
        )}
      />

      <button
        disabled={!value}
        type="submit"
        className="absolute right-2 top-4 z-50 h-8 w-8 rounded-full disabled:bg-zinc-800 bg-zinc-900 transition duration-200 flex items-center justify-center"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-300 h-4 w-4"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <motion.path
            d="M5 12l14 0"
            initial={{
              strokeDasharray: "50%",
              strokeDashoffset: "50%",
            }}
            animate={{
              strokeDashoffset: value ? 0 : "50%",
            }}
            transition={{
              duration: 0.3,
              ease: "linear",
            }}
          />
          <path d="M13 18l6 -6" />
          <path d="M13 6l6 6" />
        </motion.svg>
      </button>

      <div className="absolute inset-0 flex items-start pt-4 rounded-3xl pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{
                y: 5,
                opacity: 0,
              }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -15,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "linear",
              }}
              className="text-zinc-500 text-sm sm:text-base font-normal pl-4 sm:pl-12 text-left w-[calc(100%-2rem)] truncate"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
