import { Hash, Timer } from "lucide-react"

export default function GameStatus({ gameState }) {
  return (
    <div className="flex justify-between items-center animate-slide-right">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <Hash className="h-4 w-4 text-gray-400" />
          <span>Round: {gameState.round}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <Timer className="h-4 w-4 text-gray-400" />
          <span>Time: {gameState.timeElapsed}s</span>
        </div>
      </div>
    </div>
  )
}
