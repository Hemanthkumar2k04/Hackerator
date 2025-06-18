import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CardProps } from './Card';
import {useUser, useAuth } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface FinalStepProps {
  finalIdea: any;
  onBack: () => void;
}

const borderColors = [
  "#38bdf8", // Tech Stack
  "#a78bfa", // Description
  "#fbbf24", // Roadmap
  "#ef4444", // Challenges
  "#10b981", // Stretch Goals
  "#f472b6", // Time Estimate
];

const getCardsFromFinalIdea = (idea: any): CardProps[] => [
  {
    label: "Description",
    title: "Overview",
    description: idea.description,
    borderColor: borderColors[1],
    className: "card-desc"
  },
  {
    label: "Time Estimate",
    title: "ETA",
    description: idea.extras?.time_estimate || "",
    borderColor: borderColors[5],
    className: "card-eta"
  },
  {
    label: "Tech Stack",
    title: "Technologies",
    description: Array.isArray(idea.tech_stack) ? idea.tech_stack : [],
    borderColor: borderColors[0],
    className: "card-tech"
  },
  {
    label: "Roadmap",
    title: "Steps",
    description: Array.isArray(idea.roadmap) ? idea.roadmap : [],
    borderColor: borderColors[2],
    className: "card-roadmap"
  },
  {
    label: "Challenges",
    title: "Potential Issues",
    description: Array.isArray(idea.extras?.challenges) ? idea.extras.challenges : [],
    borderColor: borderColors[3],
    className: "card-challenges"
  },
  {
    label: "Stretch Goals",
    title: "Ambitions",
    description: Array.isArray(idea.extras?.stretch_goals) ? idea.extras.stretch_goals : [],
    borderColor: borderColors[4],
    className: "card-goals"
  }
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.11,
      type: "spring",
      stiffness: 180,
      damping: 18,
    }
  })
};

const FinalStep: React.FC<FinalStepProps> = ({ finalIdea, onBack }) => {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!finalIdea) return null;

  const cards: CardProps[] = getCardsFromFinalIdea(finalIdea);

  // Split cards into rows by order and className
  const row1 = [cards[0], cards[1]]; // Description, ETA
  const row2 = [cards[2], cards[3]]; // Tech Stack, Roadmap
  const row3 = [cards[4], cards[5]]; // Challenges, Goals

  const { getToken } = useAuth();
  const {user} = useUser();
  async function saveIdea() {
  setSaving(true);
  try {
    const token = await getToken({ template: "supabase" });

    const ideaText = [
      `Project Name: ${finalIdea.name}`,
      `Summary: ${finalIdea.summary}`,
      `Description: ${finalIdea.description}`,
      `Tech Stack: ${(finalIdea.tech_stack || []).join(', ')}`,
      `Roadmap: ${(finalIdea.roadmap || []).join('; ')}`,
      `Challenges: ${(finalIdea.extras?.challenges || []).join('; ')}`,
      `Stretch Goals: ${(finalIdea.extras?.stretch_goals || []).join('; ')}`,
      `Time Estimate: ${finalIdea.extras?.time_estimate || ''}`
    ].join('\n');

    const payload = {
      idea_name: finalIdea.name,
      idea: ideaText
    };

    await fetch("http://localhost:5000/api/save-idea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // ✅ send Clerk token
      },
      body: JSON.stringify(payload)
    });

    setSaved(true);
  } catch (err) {
    console.error("Save failed:", err);
  } finally {
    setSaving(false);
  }
}


  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#18181b] py-10">
      <h1 className="text-4xl font-extrabold text-white mb-10 text-center">{finalIdea.name}</h1>

      {/* Row 1: Description (2/3) + ETA (1/3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-8">
        <AnimatePresence>
          <motion.div
            className={`finalstep-card card-desc md:col-span-2 h-auto transition-transform duration-200 ease-in-out hover:scale-[1.07] hover:shadow-[0_0_32px_8px_${row1[0].borderColor}] bg-[#23232b] rounded-2xl border-4 p-8`}
            key={row1[0].label}
            custom={0}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={cardVariants}
            style={{
              borderColor: row1[0].borderColor,
              color: "#fff",
              boxShadow: `0 0 24px 4px ${row1[0].borderColor}`,
              '--card-glow': row1[0].borderColor,
              minWidth: "380px",
            } as React.CSSProperties}
          >
            <div className="uppercase text-sm font-semibold tracking-wider mb-2 opacity-80">{row1[0].label}</div>
            <div className="text-3xl font-extrabold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">{row1[0].title}</div>
            <div className="text-base text-zinc-200 leading-relaxed">
              {Array.isArray(row1[0].description) ? (
                <ul className="pl-4 m-0 list-disc">
                  {row1[0].description.map((item: string, i: number) => (
                    <li key={i} className="mb-1">{item}</li>
                  ))}
                </ul>
              ) : (
                row1[0].description?.split("\n").map((line: string, i: number) => (
                  <div key={i}>{line}</div>
                ))
              )}
            </div>
          </motion.div>
           {/* ETA Card: Center contents */}
      <motion.div
        className={`finalstep-card card-eta md:col-span-1 h-auto flex flex-col items-center justify-center text-center transition-transform duration-200 ease-in-out hover:scale-[1.07] hover:shadow-[0_0_32px_8px_${row1[1].borderColor}] bg-[#23232b] rounded-2xl border-4 p-8`}
        key={row1[1].label}
        custom={1}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={cardVariants}
        style={{
          borderColor: row1[1].borderColor,
          color: "#fff",
          boxShadow: `0 0 24px 4px ${row1[1].borderColor}`,
          '--card-glow': row1[1].borderColor,
          minWidth: "280px",
        } as React.CSSProperties}
      >
        <div className="uppercase text-sm font-semibold tracking-wider mb-2 opacity-80">{row1[1].label}</div>
        <div className="text-3xl font-extrabold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">{row1[1].title}</div>
        <div className="text-4xl text-zinc-200 leading-relaxed">
          {Array.isArray(row1[1].description) ? (
            <ul className="pl-4 m-0 list-disc">
              {row1[1].description.map((item: string, i: number) => (
                <li key={i} className="mb-1">{item}</li>
              ))}
            </ul>
          ) : (
            row1[1].description?.split("\n").map((line: string, i: number) => (
              <div key={i}>{line}</div>
            ))
          )}
        </div>
      </motion.div>
        </AnimatePresence>
      </div>

      {/* Row 2: Tech Stack (1/3) + Roadmap (2/3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-8">
        <AnimatePresence>
          {/* Tech Stack Card: shorter height, normal width */}
          <motion.div
            className={`finalstep-card card-tech md:col-span-1 h-auto transition-transform duration-200 ease-in-out hover:scale-[1.07] hover:shadow-[0_0_32px_8px_${row2[0].borderColor}] bg-[#23232b] rounded-2xl border-4 p-8`}
            key={row2[0].label}
            custom={0}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={cardVariants}
            style={{
              borderColor: row2[0].borderColor,
              color: "#fff",
              boxShadow: `0 0 24px 4px ${row2[0].borderColor}`,
              '--card-glow': row2[0].borderColor,
              minWidth: "280px",
            } as React.CSSProperties}
          >
            <div className="uppercase text-sm font-semibold tracking-wider mb-2 opacity-80">{row2[0].label}</div>
            <div className="text-3xl font-extrabold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">{row2[0].title}</div>
            <div className="text-base text-zinc-200 leading-relaxed">
              {Array.isArray(row2[0].description) ? (
                <ul className="pl-4 m-0 list-disc">
                  {row2[0].description.map((item: string, i: number) => (
                    <li key={i} className="mb-1">{item}</li>
                  ))}
                </ul>
              ) : (
                row2[0].description?.split("\n").map((line: string, i: number) => (
                  <div key={i}>{line}</div>
                ))
              )}
            </div>
          </motion.div>
          {/* Roadmap Card: wider, normal height */}
          <motion.div
            className={`finalstep-card card-roadmap md:col-span-2 h-auto transition-transform duration-200 ease-in-out hover:scale-[1.07] hover:shadow-[0_0_32px_8px_${row2[1].borderColor}] bg-[#23232b] rounded-2xl border-4 p-8`}
            key={row2[1].label}
            custom={1}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={cardVariants}
            style={{
              borderColor: row2[1].borderColor,
              color: "#fff",
              boxShadow: `0 0 24px 4px ${row2[1].borderColor}`,
              '--card-glow': row2[1].borderColor,
              minWidth: "500px",
            } as React.CSSProperties}
          >
            <div className="uppercase text-sm font-semibold tracking-wider mb-2 opacity-80">{row2[1].label}</div>
            <div className="text-3xl font-extrabold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">{row2[1].title}</div>
            <div className="text-base text-zinc-200 leading-relaxed">
              {Array.isArray(row2[1].description) ? (
                <ul className="pl-4 m-0 list-disc">
                  {row2[1].description.map((item: string, i: number) => (
                    <li key={i} className="mb-1">{item}</li>
                  ))}
                </ul>
              ) : (
                row2[1].description?.split("\n").map((line: string, i: number) => (
                  <div key={i}>{line}</div>
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Row 3: Challenges (1/2) + Goals (1/2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-8">
        <AnimatePresence>
          {row3.map((card, idx) => (
            <motion.div
              className={`finalstep-card ${card.className || ""} h-auto transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-[0_0_32px_8px_${card.borderColor}] bg-[#23232b] rounded-2xl border-4 p-8`}
              key={card.label}
              custom={idx}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={cardVariants}
              style={{
                borderColor: card.borderColor,
                color: "#fff",
                boxShadow: `0 0 24px 4px ${card.borderColor}`,
                '--card-glow': card.borderColor,
                minWidth: "340px",
              } as React.CSSProperties}
            >
              <div className="uppercase text-sm font-semibold tracking-wider mb-2 opacity-80">{card.label}</div>
              <div className="text-2xl font-extrabold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">{card.title}</div>
              <div className="text-base text-zinc-200 leading-relaxed p-2">
                {Array.isArray(card.description) ? (
                  <ul className="pl-4 m-0 list-disc">
                    {card.description.map((item: string, i: number) => (
                      <li key={i} className="mb-1">{item}</li>
                    ))}
                  </ul>
                ) : (
                  card.description?.split("\n").map((line: string, i: number) => (
                    <div key={i}>{line}</div>
                  ))
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

     

      <div className="flex justify-center mt-8 gap-6">
        <button
          className="finalstep-save flex items-center gap-2 bg-none border-none cursor-pointer text-lg font-semibold text-white px-4 py-2 rounded transition disabled:opacity-70"
          onClick={saveIdea}
          disabled={saving || saved}
        >
          <img
            src={saved ? "/yellow-star.svg" : "/white-star.svg"}
            alt="Save"
            width={22}
            height={22}
            style={{ verticalAlign: "middle" }}
          />
          {saved ? "Saved" : saving ? "Saving..." : "Save"}
        </button>
        <button
          className="stepone-back-btn bg-zinc-800 text-white border border-zinc-600 rounded px-6 py-2 font-semibold hover:bg-zinc-700 transition"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default FinalStep;