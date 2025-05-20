import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import StepOne from '../components/StepOne';
import StepTwo from '../components/StepTwo';
import FinalStep from '../components/FinalStep';
import '../css/form.css';

function extractIdeasFromResponse(data: any): { topic: string; idea: string }[] {
  try {
    const content: string = data?.data?.message?.content || '';
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;
    const parsed = JSON.parse(jsonString);
    return parsed.ideas || [];
  } catch (e) {
    return [];
  }
}

function extractFinalIdea(data: any) {
  try {
    const content: string = data?.data?.message?.content || '';
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
}

function isSamePayload(
  payload: { topics: string[]; notes: string; userIdea: string },
  lastPayload: { topics: string[]; notes: string; userIdea: string }
) {
  return (
    Array.isArray(payload.topics) &&
    Array.isArray(lastPayload.topics) &&
    payload.topics.length === lastPayload.topics.length &&
    payload.topics.every((topic, idx) => topic === lastPayload.topics[idx]) &&
    payload.notes === lastPayload.notes &&
    payload.userIdea === lastPayload.userIdea
  );
}

const Generate: React.FC = () => {
  const [domains, setDomainsState] = useState<string[]>([]);
  const [notes, setNotesState] = useState('');
  const [idea, setIdeaState] = useState('');
  const [step, setStep] = useState(1);
  const [ideas, setIdeas] = useState<{ topic: string; idea: string }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [lastPayload, setLastPayload] = useState<{ topics: string[]; notes: string; userIdea: string } | null>(null);
  const [lastFinalInput, setLastFinalInput] = useState<{ topic: string; idea: string } | null>(null);
  const [finalIdea, setFinalIdea] = useState<any>(null);
  const [loadingRegenerate, setLoadingRegenerate] = useState(false);
  const [loadingContinue, setLoadingContinue] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);

  // Reset all generated/cached data when user changes input
  const resetGenerated = useCallback(() => {
    setIdeas([]);
    setSelected(null);
    setLastPayload(null);
    setLastFinalInput(null);
    setFinalIdea(null);
  }, []);

  // Wrap setters to reset generated data on change
  const setDomains = (val: string[]) => {
    setDomainsState(val);
    resetGenerated();
  };
  const setNotes = (val: string) => {
    setNotesState(val);
    resetGenerated();
  };
  const setIdea = (val: string) => {
    setIdeaState(val);
    resetGenerated();
  };

  const handleGenerate = async (
    payload: { topics: string[]; notes: string; userIdea: string },
    force = false
  ) => {
    if (!force) setLoadingGenerate(true);
    setLoadingRegenerate(force);
    setLoadingContinue(false);

    if (!force && lastPayload && isSamePayload(payload, lastPayload) && ideas.length > 0) {
      setStep(2);
      setLoadingGenerate(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/generate-idea-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      const extractedIdeas = extractIdeasFromResponse(data);
      setIdeas(extractedIdeas);
      setLastPayload(payload);
      setSelected(null);
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingGenerate(false);
      setLoadingRegenerate(false);
    }
  };

  const handleRegenerate = () => {
    if (lastPayload) {
      handleGenerate(lastPayload, true);
    }
  };

  const handleContinue = async () => {
    if (selected === null) return;
    const chosen = ideas[selected];

    if (
      lastFinalInput &&
      lastFinalInput.topic === chosen.topic &&
      lastFinalInput.idea === chosen.idea &&
      finalIdea
    ) {
      setStep(3);
      return;
    }

    setLoadingContinue(true);
    try {
      const response = await fetch('http://localhost:5000/generate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: chosen.topic,
          finalPrompt: chosen.idea,
        }),
      });
      const data = await response.json();
      const parsed = extractFinalIdea(data);
      setFinalIdea(parsed);
      setLastFinalInput(chosen);
      setStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingContinue(false);
    }
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <StepOne
              domains={domains}
              setDomains={setDomains}
              notes={notes}
              setNotes={setNotes}
              idea={idea}
              setIdea={setIdea}
              onGenerate={handleGenerate}
              loading={loadingGenerate}
            />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StepTwo
              ideas={ideas}
              selected={selected}
              setSelected={setSelected}
              onNext={handleContinue}
              onBack={() => setStep(1)}
              onRegenerate={handleRegenerate}
              loadingContinue={loadingContinue}
              loadingRegenerate={loadingRegenerate}
            />
          </motion.div>
        )}
        {step === 3 && finalIdea && (
          <motion.div
            key="step3"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FinalStep finalIdea={finalIdea} onBack={() => setStep(2)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Generate;
