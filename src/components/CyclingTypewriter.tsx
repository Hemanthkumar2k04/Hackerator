"use client";

import { cn } from "@/lib/utils";
import { motion} from "motion/react";
import { useEffect, useState } from "react";


export const CyclingTypewriter = ({
  phrases,
  className,
  cursorClassName,
}: {
  phrases: string[];
  className?: string;
  cursorClassName?: string;
}) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const currentPhrase = phrases[currentPhraseIndex];
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const typeIn = async () => {
      for (let i = 0; i <= currentPhrase.length; i++) {
        if (!isMounted) return;
        setVisibleChars(i);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      for (let i = currentPhrase.length; i >= 0; i--) {
        if (!isMounted) return;
        setVisibleChars(i);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    };
    typeIn();
    return () => { isMounted = false; };
  }, [currentPhraseIndex, currentPhrase, phrases.length]);

  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
        className
      )}
    >
      <div className="inline-flex relative align-middle" style={{ minHeight: "1em" }}>
        <span>
          {currentPhrase.slice(0, visibleChars).replace(/ /g, '\u00A0')}
        </span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className={cn("inline-block align-baseline", cursorClassName)}
          style={{
            height: "1em",
            width: "0.25em",
            background: "#10b981",
            display: "inline-block",
            marginLeft: "2px",
          }}
        ></motion.span>
      </div>
    </div>
  );
};
