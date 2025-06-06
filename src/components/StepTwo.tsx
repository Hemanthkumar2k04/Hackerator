
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

const NAVBAR_HEIGHT = 54; // px, adjust if your navbar is different

const StepTwo: React.FC<StepTwoProps> = ({
  ideas,
  selected,
  setSelected,
  onNext,
  onBack,
  onRegenerate,
  loadingContinue,
  loadingRegenerate,
}) => (
  <div
    className="bg-black min-h-screen w-full flex items-start justify-center pt-5"
    style={{ minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
  >
    <div
      className="min-w-[320px] w-full max-w-7xl mx-auto my-20 bg-zinc-900 rounded-2xl p-8 text-white font-mono"
      style={{
        boxShadow:
          "rgba(240, 65, 46, 0.848) 0px 0px, rgba(240, 65, 46, 0.703) -5px 5px, rgba(240, 65, 46, 0.641) -10px 10px, rgba(240, 65, 46, 0.58) -15px 15px",
      }}
    >
      <h2 className="text-2xl font-bold mb-4 tracking-wide">Select an Idea</h2>
      <div className="text-xl mb-8">Step 2/3 - Choose Your Favorite</div>
      <ul className="list-none p-0 mb-8 flex flex-col gap-4">
        {ideas.map((item, idx) => (
          <li
            key={idx}
            className={`cursor-pointer rounded-lg px-5 py-4 bg-zinc-800 border transition text-base
              ${
                selected === idx
                  ? "border-blue-500 bg-zinc-900 text-blue-400 shadow-[0_0_8px_2px_#3b82f699]"
                  : "border-transparent hover:border-orange-400 hover:bg-zinc-700"
              }`}
            onClick={() => setSelected(idx)}
          >
            <strong className="text-orange-400 text-xl">{item.topic}:</strong>{" "}
            <span className="text-white text-xl">{item.idea}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center">
        <button
          className="bg-zinc-800 text-white border border-zinc-600 rounded px-6 py-2 font-semibold hover:bg-zinc-700 transition disabled:opacity-60"
          type="button"
          onClick={onBack}
          disabled={loadingContinue || loadingRegenerate}
        >
          Back
        </button>
        <button
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded px-6 py-2 ml-4 transition disabled:opacity-60 flex items-center justify-center min-w-[140px]"
          type="button"
          onClick={onRegenerate}
          disabled={loadingRegenerate || loadingContinue}
        >
          {loadingRegenerate ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-orange-500 rounded-full animate-spin" />
          ) : (
            "Regenerate 🗘"
          )}
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded px-8 py-2 ml-4 transition disabled:opacity-60 flex items-center justify-center min-w-[140px]"
          onClick={onNext}
          disabled={selected === null || loadingContinue || loadingRegenerate}
        >
          {loadingContinue ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-blue-500 rounded-full animate-spin" />
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  </div>
);

export default StepTwo;