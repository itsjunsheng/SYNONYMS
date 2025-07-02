export const getNewClue = async ({ hiddenWord }) => {
  const res = await fetch("https://synonyms-busf.onrender.com/api/word", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "clue",
      hiddenWord,
    }),
  })

  if (!res.ok) throw new Error("Failed to fetch new clue")
  return await res.json()
}
