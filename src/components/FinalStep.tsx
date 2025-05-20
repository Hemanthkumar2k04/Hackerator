import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CardProps } from './Card';

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
    className: "wide"
  },
  {
    label: "Time Estimate",
    title: "Estimated Time",
    description: idea.extras?.time_estimate || "",
    borderColor: borderColors[5],
    className: "eta"
  },
  {
    label: "Tech Stack",
    title: "Technologies",
    description: idea.tech_stack,
    borderColor: borderColors[0],
    className: "eta second-row"
  },
  {
    label: "Roadmap",
    title: "Steps",
    description: idea.roadmap,
    borderColor: borderColors[2],
    className: "wide second-row"
  },
  
  {
    label: "Challenges",
    title: "Potential Issues",
    description: idea.extras?.challenges,
    borderColor: borderColors[3],
  },
  {
    label: "Stretch Goals",
    title: "Ambitions",
    description: idea.extras?.stretch_goals,
    borderColor: borderColors[4],
  },
  
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
  if (!finalIdea) return null;

  const cards: CardProps[] = getCardsFromFinalIdea(finalIdea);

  return (
    <div className="finalstep-main">
      <h1 className="finalstep-title">{finalIdea.name}</h1>
      <div className="finalstep-cardgrid">
        <AnimatePresence>
          {cards.map((card, idx) => (
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
                color: "#fff"
              }}
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
      <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
        <button className="stepone-back-btn" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default FinalStep;