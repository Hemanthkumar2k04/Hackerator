import React from 'react';

export interface StepOneProps {
  domains: string[];
  setDomains: (val: string[]) => void;
  notes: string;
  setNotes: (val: string) => void;
  idea: string;
  setIdea: (val: string) => void;
  onGenerate: (payload: { topics: string[]; notes: string; userIdea: string }, force?: boolean) => Promise<void>;
  loading: boolean;
}

const DOMAIN_OPTIONS = [
  'AI',
  'Health',
  'Finance',
  'Education',
  'Gaming',
  'Productivity',
  'Social',
  'Other',
];

const StepOne: React.FC<StepOneProps> = ({
  domains,
  setDomains,
  notes,
  setNotes,
  idea,
  setIdea,
  onGenerate,
  loading,
}) => {
  const handleDomainSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !domains.includes(value)) {
      setDomains([...domains, value]);
    }
    e.target.selectedIndex = 0;
  };

  const handleRemoveDomain = (idx: number) => {
    setDomains(domains.filter((_, i) => i !== idx));
  };

  // When Generate Ideas is clicked, send the correct payload
  const handleGenerate = () => {
    if (domains.length > 0 || notes.trim() !== "") {
      onGenerate({ topics: domains, notes, userIdea: "" });
    } else if (idea.trim() !== "") {
      onGenerate({ topics: [], notes: "", userIdea: idea });
    }
  };

  return (
    <div className="stepone-container big-form">
      <h2 className="stepone-title">What would the topic be?</h2>
      <div className="stepone-subtitle">Step 1/3 - Choose Topics</div>
      <div className="stepone-desc">
        Select domains or enter your own idea to generate content.
      </div>
      <div className="stepone-flex big-flex">
        <div className="stepone-card big-card">
          <label className="stepone-label">Select Domain:</label>
          <select
            className="stepone-select"
            onChange={handleDomainSelect}
            value=""
            disabled={loading}
          >
            <option value="">Choose a domain</option>
            {DOMAIN_OPTIONS.filter(opt => !domains.includes(opt)).map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="selected-domains-list">
            {domains.map((domain, idx) => (
              <span className="selected-domain-chip" key={domain}>
                {domain}
                <button
                  type="button"
                  className="remove-domain-btn"
                  onClick={() => handleRemoveDomain(idx)}
                  aria-label={`Remove ${domain}`}
                  disabled={loading}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <label className="stepone-label" style={{ marginTop: '1.5rem' }}>
            Additional Notes:
          </label>
          <textarea
            className="stepone-textarea"
            placeholder="Add any notes or requirements..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={7}
            disabled={loading}
          />
        </div>
        <div className="stepone-or-badge">or</div>
        <div className="stepone-card big-card">
          <label className="stepone-label">Your Idea:</label>
          <textarea
            className="stepone-textarea"
            placeholder="Describe your custom idea..."
            value={idea}
            onChange={e => setIdea(e.target.value)}
            rows={12}
            disabled={loading}
          />
        </div>
      </div>
      <div className="stepone-actions">
        <button
          className="stepone-generate-btn stepone-generate-ideas-btn"
          onClick={handleGenerate}
          disabled={loading || (!domains.length && !idea.trim())}
        >
          {loading ? <span className="spinner"></span> : "Generate Ideas"}
        </button>
      </div>
    </div>
  );
};

export default StepOne;