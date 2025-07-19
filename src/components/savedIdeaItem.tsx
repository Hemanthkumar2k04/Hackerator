import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const borderColors = [
  "#38bdf8", // Tech Stack
  "#a78bfa", // Description
  "#fbbf24", // Roadmap
  "#ef4444", // Challenges
  "#10b981", // Stretch Goals
  "#f472b6", // Time Estimate
];

const getCardsFromFinalIdea = (idea: any) => [
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

const SavedIdeaItem = ({ idea }) => {
  const [expanded, setExpanded] = useState(false);

  if (!idea) return null;

  const cards = getCardsFromFinalIdea(idea);
  const row1 = [cards[0], cards[1]];
  const row2 = [cards[2], cards[3]];
  const row3 = [cards[4], cards[5]];

  return (
    <div className="saved-idea-item mb-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div
        className="idea-name cursor-pointer font-bold text-lg py-4 px-6 text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-100"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {idea.name}
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="idea-details mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="w-full flex flex-col items-center bg-gray-900 py-10">
              <h1 className="text-4xl font-extrabold text-white mb-10 text-center">{idea.name}</h1>

              {/* Row 1: Description (2/3) + ETA (1/3) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-8">
                <motion.div
                  className={`finalstep-card card-desc md:col-span-2 h-auto transition-transform duration-200 ease-in-out hover:scale-[1.07] bg-gray-800 rounded-2xl border-4 p-8`}
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
                    minWidth: "380px",
                  }}
                >
                  <div className="uppercase text-sm font-semibold tracking-wider mb-2 opacity-80 text-gray-300">{row1[0].label}</div>
                  <div className="text-3xl font-extrabold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">{row1[0].title}</div>
                  <div className="text-base text-gray-200 leading-relaxed">
                    {Array.isArray(row1[0].description) ? (
                      <ul className="pl-4 m-0 list-disc">
                        {row1[0].description.map((item, i) => (
                          <li key={i} className="mb-1">{item}</li>
                        ))}
                      </ul>
                    ) : (
                      row1[0].description?.split("\n").map((line: number, i: number) => (
                        <div key={i}>{line}</div>
                      ))
                    )}
                  </div>
                </motion.div>
                <motion.div
                  className={`finalstep-card card-eta md:col-span-1 h-auto flex flex-col items-center justify-center text-center transition-transform duration-200 ease-in-out hover:scale-[1.07] bg-gray-800 rounded-2xl border-4 p-8`}
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
                    minWidth: "280px",
                  }}
                >
                  <div className="uppercase text-sm font-semibold tracking-wider mb-2 opacity-80 text-gray-300">{row1[1].label}</div>
                  <div className="text-3xl font-extrabold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">{row1[1].title}</div>
                  <div className="text-4xl text-gray-200 leading-relaxed">
                    {Array.isArray(row1[1].description) ? (
                      <ul className="pl-4 m-0 list-disc">
                        {row1[1].description.map((item, i) => (
                          <li key={i} className="mb-1">{item}</li>
                        ))}
                      </ul>
                    ) : (
                      row1[1].description?.split("\n").map((line:number , i:number) => (
                        <div key={i}>{line}</div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Row 2: Tech Stack (1/3) + Roadmap (2/3) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-8">
                <motion.div
                  className={`finalstep-card card-tech md:col-span-1 h-auto transition-transform duration-200 ease-in-out hover:scale-[1.07] bg-gray-800 rounded-2xl border-4 p-8`}
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
                    minWidth: "280px",
                  }}
                >
                  <div className="uppercase text-sm font-semibold tracking-wider mb-2 opacity-80 text-gray-300">{row2[0].label}</div>
                  <div className="text-3xl font-extrabold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">{row2[0].title}</div>
                  <div className="text-base text-gray-200 leading-relaxed">
                    {Array.isArray(row2[0].description) ? (
                      <ul className="pl-4 m-0 list-disc">
                        {row2[0].description.map((item, i) => (
                          <li key={i} className="mb-1">{item}</li>
                        ))}
                      </ul>
                    ) : (
                      row2[0].description?.split("\n").map((line: number, i: number) => (
                        <div key={i}>{line}</div>
                      ))
                    )}
                  </div>
                </motion.div>
                <motion.div
                  className={`finalstep-card card-roadmap md:col-span-2 h-auto transition-transform duration-200 ease-in-out hover:scale-[1.07] bg-gray-800 rounded-2xl border-4 p-8`}
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
                    minWidth: "500px",
                  }}
                >
                  <div className="uppercase text-sm font-semibold tracking-wider mb-2 opacity-80 text-gray-300">{row2[1].label}</div>
                  <div className="text-3xl font-extrabold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">{row2[1].title}</div>
                  <div className="text-base text-gray-200 leading-relaxed">
                    {Array.isArray(row2[1].description) ? (
                      <ul className="pl-4 m-0 list-disc">
                        {row2[1].description.map((item, i) => (
                          <li key={i} className="mb-1">{item}</li>
                        ))}
                      </ul>
                    ) : (
                      row2[1].description?.split("\n").map((line:number, i:number) => (
                        <div key={i}>{line}</div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Row 3: Challenges (1/2) + Goals (1/2) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-8">
                {row3.map((card, idx) => (
                  <motion.div
                    className={`finalstep-card ${card.className || ""} h-auto transition-transform duration-200 ease-in-out hover:scale-105 bg-gray-800 rounded-2xl border-4 p-8`}
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
                      minWidth: "340px",
                    }}
                  >
                    <div className="uppercase text-sm font-semibold tracking-wider mb-2 opacity-80 text-gray-300">{card.label}</div>
                    <div className="text-2xl font-extrabold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]">{card.title}</div>
                    <div className="text-base text-gray-200 leading-relaxed p-2">
                      {Array.isArray(card.description) ? (
                        <ul className="pl-4 m-0 list-disc">
                          {card.description.map((item, i) => (
                            <li key={i} className="mb-1">{item}</li>
                          ))}
                        </ul>
                      ) : (
                        card.description?.split("\n").map((line:number, i: number) => (
                          <div key={i}>{line}</div>
                        ))
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center mt-8 gap-6">
                <button
                  className="stepone-back-btn bg-gray-700 text-white border border-gray-600 rounded px-6 py-2 font-semibold hover:bg-gray-600 transition"
                  onClick={() => setExpanded(false)}
                >
                  Back
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavedIdeaItem;