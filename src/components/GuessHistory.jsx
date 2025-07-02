export default function GuessHistory({ guesses }) {
  const total = guesses.length;

  return (
    <div className="space-y-2 max-h-30 overflow-y-auto custom-scrollbar">
      {[...guesses].reverse().map((g, i) => (
        <div key={i} className="flex justify-between items-center bg-gray-900">
          <span className="font-large text-gray-500">
            {total - i}. {g.guess}
          </span>
        </div>
      ))}
    </div>
  );
}
