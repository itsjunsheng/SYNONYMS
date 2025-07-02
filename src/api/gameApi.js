export const getNewClue = async ({ hiddenWord, previousGuesses }) => {
  const res = await fetch("http://localhost:3001/api/word", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "clue",
      hiddenWord,
      previousGuesses,
    }),
  })

  if (!res.ok) throw new Error("Failed to fetch new clue")
  return await res.json()
}
