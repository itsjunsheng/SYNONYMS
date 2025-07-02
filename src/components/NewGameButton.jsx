import { Loader2, Play } from "lucide-react"

export default function NewGameButton({ isGameActive, isLoading, onStart, gameWon }) {
  const showStart = !isGameActive || gameWon

  return (
    <div className="flex justify-end w-full animate-slide-left">
      {showStart && (
        <button 
          onClick={onStart} 
          disabled={isLoading}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Starting...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              New Game
            </>
          )}
        </button>
      )}
    </div>
  )
}
