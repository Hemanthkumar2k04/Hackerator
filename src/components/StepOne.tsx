
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

  const handleGenerate = () => {
    if (domains.length > 0 || notes.trim() !== "") {
      onGenerate({ topics: domains, notes, userIdea: "" });
    } else if (idea.trim() !== "") {
      onGenerate({ topics: [], notes: "", userIdea: idea });
    }
  };

  return (
    <div
      className="bg-black w-full flex items-start justify-center pt-12"
      style={{ minHeight: "calc(100vh - 55px)" }} // Adjust 64px to your actual navbar height if needed
    >
      <div
        className="min-w-[320px] w-[80vw] mx-auto my-6 bg-zinc-900 rounded-xl p-6 text-white font-mono"
        style={{
          boxShadow:
            "rgba(240, 65, 46, 0.848) 0px 0px, rgba(240, 65, 46, 0.703) -5px 5px, rgba(240, 65, 46, 0.641) -10px 10px, rgba(240, 65, 46, 0.58) -15px 15px",
        }}
      >
        <h2 className="text-4xl font-bold mb-2 tracking-wide">What would the topic be?</h2>
        <div className="text-xl mb-2">Step 1/3 - Choose Topics</div>
        <div className="text-l mb-8 text-zinc-300">Select domains or enter your own idea to generate content.</div>
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-1 bg-zinc-800 rounded-lg p-7 flex flex-col min-w-0 border border-orange-400 shadow-[0_0_8px_2px_#f0412e99]">
            <label className="font-semibold mb-3">Select Domain:</label>
            <select
              className="w-full mb-3 px-4 py-3 rounded bg-zinc-900 text-white text-lg focus:outline-none"
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
            <div className="flex flex-wrap gap-2 mb-6">
              {domains.map((domain, idx) => (
                <span
                  className="border border-red-400 text-white rounded-2xl px-4 py-1 flex items-center text-base shadow"
                  key={domain}
                >
                  {domain}
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:bg-red-100 rounded-full px-2 transition"
                    onClick={() => handleRemoveDomain(idx)}
                    aria-label={`Remove ${domain}`}
                    disabled={loading}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <label className="font-semibold mt-6 mb-3">Additional Notes:</label>
            <textarea
              className="w-full min-h-[100px] px-4 py-3 rounded bg-zinc-900 border border-zinc-700 text-white text-lg focus:outline-none resize-none"
              placeholder="Add any notes or requirements..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              disabled={loading}
            />
          </div>
          <div className="self-center mx-0 my-6 lg:my-0 lg:mx-4 bg-zinc-900 text-red-orange rounded-full px-6 py-2 font-semibold shadow-red-orange text-lg border border-orange-400">
            or
          </div>
          <div className="flex-1 bg-zinc-800 rounded-lg p-7 flex flex-col min-w-0 border border-orange-400 shadow-[0_0_8px_2px_#f0412e99]">
            <label className="font-semibold mb-3">Your Idea:</label>
            <textarea
              className="w-full min-h-[120px] px-4 py-3 rounded bg-zinc-900 border border-zinc-700 text-white text-lg focus:outline-none resize-none"
              placeholder="Describe your custom idea..."
              value={idea}
              onChange={e => setIdea(e.target.value)}
              rows={8}
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3 rounded transition min-w-[160px] flex items-center justify-center disabled:opacity-60"
            onClick={handleGenerate}
            disabled={loading || (!domains.length && !idea.trim())}
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-blue-500 rounded-full animate-spin"></span>
            ) : (
              "Generate Ideas"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepOne;