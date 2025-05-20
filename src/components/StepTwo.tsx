import React from 'react';


export interface StepTwoProps {
  ideas: { topic: string; idea: string }[];
  selected: number | null;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  onNext: () => Promise<void>;
  onBack: () => void;
  onRegenerate: () => void;
  loadingContinue: boolean;
  loadingRegenerate: boolean;
}

const StepTwo: React.FC<StepTwoProps> = ({
  ideas, selected, setSelected, onNext, onBack, onRegenerate, loadingContinue, loadingRegenerate
}) => (
  <div className="stepone-container big-form">
    <h2 className="stepone-title">Select an Idea</h2>
    <div className="stepone-subtitle">Step 2/3 - Choose Your Favorite</div>
    <ul className="ideas-list">
      {ideas.map((item, idx) => (
        <li
          key={idx}
          className={`idea-item${selected === idx ? ' selected' : ''}`}
          onClick={() => setSelected(idx)}
        >
          <strong>{item.topic}:</strong> {item.idea}
        </li>
      ))}
    </ul>
    <div className="stepone-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <button
        className="stepone-back-btn"
        type="button"
        onClick={onBack}
        disabled={loadingContinue || loadingRegenerate}
      >
        Back
      </button>
      <button
        className="stepone-generate-btn"
        type="button"
        style={{ marginRight: 'auto', marginLeft: '1rem' }}
        onClick={onRegenerate}
        disabled={loadingRegenerate || loadingContinue}
      >
        {loadingRegenerate ? <span className="spinner"></span> : "Regenerate"}
      </button>
      <button
        className="stepone-generate-btn"
        onClick={onNext}
        disabled={selected === null || loadingContinue || loadingRegenerate}
      >
        {loadingContinue ? <span className="spinner"></span> : "Continue"}
      </button>
    </div>
  </div>
);

export default StepTwo;