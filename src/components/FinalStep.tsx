import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CardProps } from './Card';
import { useAuth } from "@clerk/clerk-react";
import { v4 as uuidv4 } from 'uuid';

interface FinalStepProps {
  finalIdea: any;
  onBack: () => void;
}

// Define punchy border colors for each card
const borderColors = [
  "#38bdf8", // Tech Stack
  "#a78bfa", // Description
  "#fbbf24", // Roadmap
  "#ef4444", // Challenges
  "#10b981", // Stretch Goals
  "#f472b6", // Time Estimate
];

// Helper to map finalIdea to cards
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

  async function saveIdea() {
    setSaving(true);
    try {
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
        id: uuidv4(),
        name: finalIdea.name,
        text: ideaText
      };
  
      const token: string | null = await getToken();
      await fetch("http://localhost:5000/api/save-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ idea: payload }),
      });
      setSaved(true);
    } catch (error) {
      // Optionally handle error
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="finalstep-main">
      <h1 className="finalstep-title">{finalIdea.name}</h1>

      {/* Row 1: Description (2/3) + ETA (1/3) */}
      <div className="finalstep-row finalstep-row1">
        <AnimatePresence>
          {row1.map((card, idx) => (
            <motion.div
              className={`finalstep-card ${card.className || ""}`}
              key={card.label}
              custom={idx}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={cardVariants}
              style={{
                borderColor: card.borderColor,
                background: "#23232b",
                color: "#fff",
                '--card-glow': card.borderColor
              } as React.CSSProperties}
            >
              <div className="finalstep-card-label">{card.label}</div>
              <div className="finalstep-card-title">{card.title}</div>
              <div className="finalstep-card-desc">
                {Array.isArray(card.description) ? (
                  <ul style={{ paddingLeft: 18, margin: 0 }}>
                    {card.description.map((item: string, i: number) => (
                      <li key={i} style={{ marginBottom: 4 }}>{item}</li>
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

      {/* Row 2: Tech Stack (1/3) + Roadmap (2/3) */}
      <div className="finalstep-row finalstep-row2">
        <AnimatePresence>
          {row2.map((card, idx) => (
            <motion.div
              className={`finalstep-card ${card.className || ""}`}
              key={card.label}
              custom={idx}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={cardVariants}
              style={{
                borderColor: card.borderColor,
                background: "#23232b",
                color: "#fff",
                '--card-glow': card.borderColor
              } as React.CSSProperties}
            >
              <div className="finalstep-card-label">{card.label}</div>
              <div className="finalstep-card-title">{card.title}</div>
              <div className="finalstep-card-desc">
                {Array.isArray(card.description) ? (
                  <ul style={{ paddingLeft: 18, margin: 0 }}>
                    {card.description.map((item: string, i: number) => (
                      <li key={i} style={{ marginBottom: 4 }}>{item}</li>
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

      {/* Row 3: Challenges (1/2) + Goals (1/2) */}
      <div className="finalstep-row finalstep-row3">
        <AnimatePresence>
          {row3.map((card, idx) => (
            <motion.div
              className={`finalstep-card ${card.className || ""}`}
              key={card.label}
              custom={idx}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={cardVariants}
              style={{
                borderColor: card.borderColor,
                background: "#23232b",
                color: "#fff",
                '--card-glow': card.borderColor
              } as React.CSSProperties}
            >
              <div className="finalstep-card-label">{card.label}</div>
              <div className="finalstep-card-title">{card.title}</div>
              <div className="finalstep-card-desc">
                {Array.isArray(card.description) ? (
                  <ul style={{ paddingLeft: 18, margin: 0 }}>
                    {card.description.map((item: string, i: number) => (
                      <li key={i} style={{ marginBottom: 4 }}>{item}</li>
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

      <div style={{ display: "flex", justifyContent: "center", marginTop: 32, gap: 16 }}>
        <button
          className="finalstep-save"
          onClick={saveIdea}
          disabled={saving || saved}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: saving || saved ? "not-allowed" : "pointer",
            fontSize: "1.1rem",
            color: "#fff"
          }}
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
        <button className="stepone-back-btn" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default FinalStep;