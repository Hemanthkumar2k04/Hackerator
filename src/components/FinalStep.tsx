import React from 'react';

interface FinalStepProps {
  finalIdea: any;
  onBack: () => void;
}

const FinalStep: React.FC<FinalStepProps> = ({ finalIdea, onBack }) => {
  if (!finalIdea) return null;
  return (
    <div className="stepone-container big-form">
      <h2 className="stepone-title">{finalIdea.name}</h2>
      <div className="stepone-subtitle">{finalIdea.summary}</div>
      <p style={{ margin: '1.5rem 0', color: '#d1d5db' }}>{finalIdea.description}</p>
      <div>
        <strong>Tech Stack:</strong> {finalIdea.tech_stack?.join(', ')}
      </div>
      {finalIdea.roadmap && (
        <div style={{ margin: '1.5rem 0' }}>
          <strong>Roadmap:</strong>
          <ol>
            {finalIdea.roadmap.map((step: string, idx: number) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      )}
      {finalIdea.extras && (
        <div>
          {finalIdea.extras.challenges && (
            <>
              <strong>Challenges:</strong>
              <ul>
                {finalIdea.extras.challenges.map((c: string, idx: number) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </>
          )}
          {finalIdea.extras.stretch_goals && (
            <>
              <strong>Stretch Goals:</strong>
              <ul>
                {finalIdea.extras.stretch_goals.map((g: string, idx: number) => (
                  <li key={idx}>{g}</li>
                ))}
              </ul>
            </>
          )}
          {finalIdea.extras.time_estimate && (
            <div>
              <strong>Time Estimate:</strong> {finalIdea.extras.time_estimate}
            </div>
          )}
        </div>
      )}
      <div className="stepone-actions" style={{ marginTop: '2rem' }}>
        <button className="stepone-back-btn" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default FinalStep;