import { Loader2 } from "lucide-react"

export default function ClueDisplay({ isLoading, currentClue, gameWon, gaveUp, hiddenWord }) {
  const showResult = gameWon || gaveUp

  let displayContent
  let boxClasses = "text-2xl font-bold rounded-lg p-3 h-[60px] flex items-center justify-center "

  if (gameWon) {
    displayContent = <span>Congratulations!</span>
    boxClasses += "bg-green-200 text-green-800"
  } else if (gaveUp) {
    displayContent = <span>Game Over!</span>
    boxClasses += "bg-red-200 text-red-800"
  } else {
    displayContent = currentClue 
    boxClasses += "bg-gray-800 text-blue-600"
  }

  return (
    <div className="relative text-center">
      {/* Clue or outcome box */}
      <div className={boxClasses}>
        {displayContent}
      </div>

      {/* Reveal hidden word after game ends */}
      {showResult && (
        <p className="pt-6.5 pb-4 text-center text-sm text-gray-600">
          The hidden word was:{" "}
          <span
            className={`font-bold ${
              gameWon ? "text-green-600" : "text-red-600"
            }`}
          >
            {hiddenWord}
          </span>
        </p>
      )}

      {/* Loader overlay */}
      {isLoading && (
        <div className="absolute inset-0 h-[60px] flex items-center justify-center bg-white/80 rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-500">Generating new clue...</span>
        </div>
      )}
    </div>
  )
}
