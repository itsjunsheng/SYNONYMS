import { useEffect, useState } from "react"
import { getNewClue } from "./api/gameApi"
import { words } from "./assets/wordlist"
import ClueDisplay from "./components/ClueDisplay"
import Credits from "./components/Credits"
import GameMenu from "./components/GameMenu"
import GameStatus from "./components/GameStatus"
import GuessHistory from "./components/GuessHistory"
import Header from "./components/Header"
import InputField from "./components/InputField"
import Instructions from "./components/Instructions"
import Modal from "./components/Modal"
import NewGameButton from "./components/NewGameButton"
import ShareButtons from "./components/ShareButtons"

// Initial game state
const initialGameState = {
  hiddenWord: "",
  currentClue: "",
  guesses: [],
  isGameActive: false,
  isLoading: false,
  round: 0,
  gameWon: false,
  gaveUp: false,
  timeElapsed: 0,
}

export default function Synonyms() {
  const [gameState, setGameState] = useState(initialGameState)
  const [showCredits, setShowCredits] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  // Start new game 
  const startNewGame = async () => {
    setGameState((prev) => ({ ...prev, isLoading: true }))

    //randomly pick a word from the wordlists
    const randomWord = words[Math.floor(Math.random() * words.length)]

    try {
      const clueResponse = await getNewClue({
        hiddenWord: randomWord,
        previousGuesses: [],
      })

      setGameState({
        ...initialGameState,
        hiddenWord: randomWord,
        currentClue: clueResponse.clue,
        isGameActive: true,
        round: 1,
      })
    } catch {
      alert("Failed to start game.")
      setGameState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  // Game timer (timer run when game is active and no modal is open)
  useEffect(() => {
    let interval
    if (gameState.isGameActive && !showCredits && !showInstructions) {
      interval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1,
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState.isGameActive, showCredits, showInstructions])

  // Press Spacebar to start game
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.code === "Space" &&
        !gameState.isGameActive &&
        !gameState.isLoading &&
        !showCredits &&
        !showInstructions
      ) {
        e.preventDefault()
        startNewGame()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState.isGameActive, gameState.isLoading, showCredits, showInstructions])

  const makeGuess = async (guess) => {
    if (!gameState.isGameActive || gameState.isLoading) return

    const newGuesses = [...gameState.guesses, { guess, round: gameState.round }]

    // Player guessed the word correctly
    if (guess.toLowerCase() === gameState.hiddenWord.toLowerCase()) {
      setGameState((prev) => ({
        ...prev,
        guesses: newGuesses,
        gameWon: true,
        isGameActive: false,
      }))
      return
    }

    // Player guessed wrong and get next clue
    setGameState((prev) => ({
      ...prev,
      isLoading: true,
      guesses: newGuesses,
      round: prev.round + 1,
    }))

    try {
      const data = await getNewClue({
        hiddenWord: gameState.hiddenWord,
        previousGuesses: newGuesses.map((g) => g.guess),
      })

      setGameState((prev) => ({
        ...prev,
        currentClue: data.clue,
        isLoading: false,
      }))
    } catch {
      alert("Failed to get new clue.")
      setGameState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  // Handles form submission from guess input
  const handleSubmit = (e) => {
    e.preventDefault()
    const guess = new FormData(e.target).get("guess")?.trim()
    if (guess) {
      makeGuess(guess)
      e.target.reset()
    }
  }

  // When player gives up manually
  const handleGiveUp = () => {
    setGameState((prev) => ({ ...prev, isGameActive: false, gaveUp: true }))
  }

  //UI Layout
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-xl mx-auto space-y-4 p-8">
        <Header />

        <div className="flex justify-between items-center">
          <GameStatus gameState={gameState} />
          <GameMenu
            onGiveUp={handleGiveUp}
            isGameActive={gameState.isGameActive}
            onShowCredits={() => setShowCredits(true)}
            onShowInstructions={() => setShowInstructions(true)}
          />
        </div>

        {!gameState.isGameActive && !gameState.gameWon && !gameState.gaveUp ? (
          <div className="bg-gray-800 rounded-lg p-4 animate-fade-in">
            <Instructions />
          </div>
        ) : (
          <ClueDisplay {...gameState} />
        )}

        {gameState.isGameActive && !gameState.gameWon && !gameState.gaveUp && (
          <InputField onSubmit={handleSubmit} disabled={gameState.isLoading} />
        )}

        {gameState.guesses.length > 0 && (
          <GuessHistory guesses={gameState.guesses} />
        )}

        <div className="flex justify-between items-center pt-1 w-full">
          {gameState.gameWon ? (
            <ShareButtons
              word={gameState.hiddenWord}
              time={gameState.timeElapsed}
              guesses={gameState.guesses.length}
            />
          ) : (
            <div />
          )}

          <NewGameButton
            isGameActive={gameState.isGameActive}
            isLoading={gameState.isLoading}
            onStart={startNewGame}
            gameWon={gameState.gameWon}
          />
        </div>
      </div>

      <Modal isOpen={showCredits} onClose={() => setShowCredits(false)}>
        <Credits />
      </Modal>

      <Modal isOpen={showInstructions} onClose={() => setShowInstructions(false)}>
        <Instructions />
      </Modal>
    </div>
  )
}
